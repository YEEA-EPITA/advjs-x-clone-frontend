import React, { useState, useEffect } from "react";
import useAppStateContext from "../hooks/useAppStateContext";
import { xcloneApi } from "../constants/axios";
import { pollRequests } from "../constants/requests";
import "./PollShowComponent.css";

const PollComponentDetail = ({ post }) => {
  const { appState, dispatch } = useAppStateContext();
  const token = appState?.user?.token;

  const [pollData, setPollData] = useState(post.poll);

  useEffect(() => {
    setPollData(post.poll);
  }, [post.poll]);

  const hasVoted = pollData?.voted;
  const totalVotes = pollData?.options?.reduce((sum, opt) => sum + opt.vote_count, 0);
  const isExpired = new Date(pollData?.expires_at) < new Date();

  const handleVote = async (optionId) => {
    if (hasVoted || isExpired) return;

    try {
      const response = await xcloneApi.post(
        pollRequests.votePoll,
        {
          post_id: post.id,
          option_id: optionId,
          poll_id: pollData.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.poll) {
        setPollData({
          ...response.data.poll,
          options: response.data.options || [],
        });

        dispatch({
          type: "USER_VOTED_POLL",
          payload: {
            postId: post.id,
            pollId: pollData.id,
            optionId: optionId,
          },
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div
      className={`poll-container ${hasVoted ? "poll-voted" : ""} ${
        isExpired ? "poll-expired" : ""
      }`}
    >
      <h4>{pollData?.question}</h4>

      <div className="poll-options">
        {pollData?.options?.map((option) => {
          const voteCount = option.vote_count || 0;
          const percentage = totalVotes
            ? Math.round((voteCount / totalVotes) * 100)
            : 0;
          const isUserChoice =
            pollData?.selected_option_id &&
            pollData.selected_option_id === option.id;

          return (
            <div
              key={option.id}
              className={`poll-option ${
                isUserChoice ? "poll-option-voted" : ""
              }`}
              style={{
                "--vote-percentage": `${percentage}%`,
                cursor: hasVoted || isExpired ? "default" : "pointer",
              }}
              onClick={() => handleVote(option.id)}
            >
              <div className="poll-option-content">
                <span className="poll-option-text">
                  {option.option_text}
                  {isUserChoice && (
                    <i className="fas fa-check-circle poll-user-vote"></i>
                  )}
                </span>
                <span className="poll-votes">
                  {hasVoted ? `${percentage}%` : `${voteCount} votes`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="poll-info">
        <div className="poll-status">
          {hasVoted ? (
            <>
              <i className="fas fa-check-circle"></i>
              <span>You voted</span>
            </>
          ) : isExpired ? (
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
          <span className="poll-total-votes">{totalVotes} votes</span>
          <span>•</span>
          <span>
            Expires:{" "}
            {pollData?.expires_at
              ? new Date(pollData.expires_at).toLocaleDateString()
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PollComponentDetail;
