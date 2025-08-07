import "../styles/PollShowComponent.css";
import React, { useEffect } from "react";
import useAppStateContext from "../hooks/useAppStateContext";
import { xcloneApi } from "../constants/axios";
import { pollRequests } from "../constants/requests";

const PollShowComponent = ({ post }) => {
  const { appState, dispatch } = useAppStateContext();
  const socket = appState.socket;

  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  const handleVote = async (optionId, postId) => {
    if (post.poll.voted || new Date(post.poll.expires_at) < new Date()) {
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

      if (response.data.success && response.data.body?.poll) {
        dispatch({
          type: "UPDATE_POLL_AFTER_VOTE",
          payload: {
            postId: post.id,
            updatedPoll: response.data.body.poll,
          },
        });

        // Save user vote locally
        const pollVotes = JSON.parse(localStorage.getItem("pollVotes")) || {};
        localStorage.setItem(
          "pollVotes",
          JSON.stringify({
            ...pollVotes,
            [post.poll.id]: response.data.body.poll.selected_option_id,
          })
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  useEffect(() => {
    if (!socket || !post?.poll?.id) return;

    const updatePollState = (updatedPoll) => {
      if (updatedPoll.poll.id !== post.poll.id) return;

      dispatch({
        type: "UPDATE_POLL_AFTER_VOTE",
        payload: {
          postId: post.id,
          updatedPoll: updatedPoll.poll,
        },
      });
    };

    socket.on("pollUpdated", updatePollState);
    return () => socket.off("pollUpdated", updatePollState);
  }, [socket, post?.poll?.id]);

  const pollVotes = JSON.parse(localStorage.getItem("pollVotes")) || {};
  const selected_option_id = pollVotes[post?.poll?.id] || null;
  const voted = !!selected_option_id;
  const pollExpired = new Date(post?.poll?.expires_at) < new Date();

  return (
    <>
      {post?.poll && (
        <div
          className={`poll-container ${voted ? "poll-voted" : ""} ${
            pollExpired ? "poll-expired" : ""
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

              const isUserChoice = voted && option.id === selected_option_id;

              return (
                <div
                  key={option.id}
                  className={`poll-option ${
                    isUserChoice ? "poll-option-voted" : ""
                  }`}
                  style={{
                    "--vote-percentage": `${percentage}%`,
                    cursor: voted || pollExpired ? "default" : "pointer",
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
                      {voted ? `${percentage}%` : `${option.vote_count} votes`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="poll-info">
            <div className="poll-status">
              {voted ? (
                <>
                  <i className="fas fa-check-circle"></i>
                  <span>You voted</span>
                </>
              ) : pollExpired ? (
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
