import React, { useEffect, useState, useContext } from "react";
import { xcloneApi } from "../constants/axios";
import { postRequests } from "../constants/requests";
import { AppStateContext } from "../context/AppStateProvider";

const PostLikeComponent = ({ className, post }) => {
  const { appState, dispatch } = useContext(AppStateContext);
  const { socket, user } = appState;
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.like_count);

  useEffect(() => {
    if (!socket || !post?.id) return;

    const handleSocketLike = ({ post_id, like_count, userId, action }) => {
      if (post_id !== post.id) return;

      setLikeCount(like_count);
      if (userId === user.userId) {
        setLiked(action === "like");
      }
    };

    socket.on("likeUpdated", handleSocketLike);
    return () => socket.off("likeUpdated", handleSocketLike);
  }, [socket, post.id, user.id]);

  const handleLike = async () => {
    try {
      await xcloneApi.post(
        postRequests.likePost(post.id),
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (err) {
      console.error("Like error", err);
    }
  };

  return (
    <div
      className={className}
      onClick={handleLike}
      style={{
        color: liked ? "var(--accent-red)" : "inherit",
        cursor: "pointer",
      }}
    >
      <i className="fas fa-heart"></i>
      <span>{likeCount}</span>
    </div>
  );
};

export default PostLikeComponent;
