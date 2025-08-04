import "../styles/PollShowComponent.css";
import React, { useEffect, useState } from "react";
import useAppStateContext from "../hooks/useAppStateContext";
import { xcloneApi } from "../constants/axios";
import { pollRequests } from "../constants/requests";

const PollShowComponent = ({ post }) => {
  const { appState, dispatch } = useAppStateContext();

  const socket = appState.socket;

  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  const handleVote = async (optionId, postId) => {
    // Check if current user has already voted using the API structure
    const hasUserVoted = post.poll.voted;

    // Prevent voting if current user already voted or poll expired
    if (hasUserVoted || new Date(post.poll.expires_at) < new Date()) {
      return;
    }

    try {
      const response = await xcloneApi.post(
        pollRequests.votePoll,
        {
          post_id: postId,
          option_id: optionId,
          poll_id: post.poll.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Only update the current user's voting status after successful vote
      if (response.data.success) {
        dispatch({
          type: "USER_VOTED_POLL",
          payload: {
            postId: post.id,
            pollId: post.poll.id,
            optionId: optionId,
          },
        });
        
        dispatch({
          type: "CACHE_POLL_VOTE",
          payload: { pollId: post.poll.id, optionId },
        });

        localStorage.setItem(
          "pollVotes",
          JSON.stringify({
            ...(JSON.parse(localStorage.getItem("pollVotes")) || {}),
            [post.poll.id]: optionId,
          })
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // update the poll state after voting with the help of socket or state management
  useEffect(() => {
    if (!socket || !post?.poll?.id) return;

    const updatePollState = (updatedPoll) => {
      if (updatedPoll.poll_id !== post.poll.id) return; // Only listen to own poll
      dispatch({
        type: "UPDATE_POLL_VOTES",
        payload: {
          postId: post.id,
          pollId: post.poll.id,
          optionId: updatedPoll.option_id,
        },
      });
    };

    socket.on("pollUpdated", updatePollState);

    return () => {
      socket.off("pollUpdated", updatePollState);
    };
  }, [socket, post?.poll?.id]);

  return (
    <>
      {post?.poll && (
        <div
          className={`poll-container ${post.poll.voted ? "poll-voted" : ""} ${
            new Date(post.poll.expires_at) < new Date() ? "poll-expired" : ""
          }`}
        >
          <h4>{post.poll.question}</h4>
          <div className="poll-options">
            {post.poll.options.map((option) => {
              const totalVotes = post.poll.options.reduce(
                (sum, opt) => sum + opt.vote_count,
                0
              );
              const percentage =
                totalVotes > 0
                  ? Math.round((option.vote_count / totalVotes) * 100)
                  : 0;
              const isUserChoice =
                post.poll.voted && option.id === post.poll.selected_option_id;

              return (
                <div
                  key={option.id}
                  className={`poll-option ${
                    isUserChoice ? "poll-option-voted" : ""
                  }`}
                  style={{
                    "--vote-percentage": `${percentage}%`,
                    cursor:
                      post.poll.voted ||
                      new Date(post.poll.expires_at) < new Date()
                        ? "default"
                        : "pointer",
                  }}
                  onClick={() => handleVote(option.id, post.id)}
                >
                  <div className="poll-option-content">
                    <span className="poll-option-text">
                      {option.option_text}
                      {isUserChoice && (
                        <i className="fas fa-check-circle poll-user-vote"></i>
                      )}
                    </span>
                    <span className="poll-votes">
                      {post.poll.voted
                        ? `${percentage}%`
                        : `${option.vote_count} votes`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="poll-info">
            <div className="poll-status">
              {post.poll.voted ? (
                <>
                  <i className="fas fa-check-circle"></i>
                  <span>You voted</span>
                </>
              ) : new Date(post.poll.expires_at) < new Date() ? (
                <>
                  <i className="fas fa-clock"></i>
                  <span>Poll ended</span>
                </>
              ) : (
                <>
                  <i className="fas fa-poll"></i>
                  <span>Poll active</span>
                </>
              )}
            </div>
            <div className="poll-details">
              <span className="poll-total-votes">
                {post.poll.options.reduce(
                  (sum, opt) => sum + opt.vote_count,
                  0
                )}{" "}
                votes
              </span>
              <span>•</span>
              <span>
                Expires: {new Date(post.poll.expires_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PollShowComponent;
