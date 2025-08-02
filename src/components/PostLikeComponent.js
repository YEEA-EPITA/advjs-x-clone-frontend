import React, { useEffect, useState } from "react";
import { xcloneApi } from "../constants/axios";
import { postRequests } from "../constants/requests";
import useAppStateContext from "../hooks/useAppStateContext";

const PostLikeComponent = ({ className, post }) => {
  const { appState, dispatch } = useAppStateContext();
  const socket = appState.socket;
  const [optimisticUpdate, setOptimisticUpdate] = useState(null);

  // Socket listener for real-time like updates
  useEffect(() => {
    if (!socket || !post?.id) return;

    const updateLikeState = (updatedLike) => {
      if (updatedLike.post_id !== post.id) return; // Only listen to own post

      // Clear optimistic update and use server data as source of truth
      setOptimisticUpdate(null);

      // Always update from socket (this will be correct for everyone)
      dispatch({
        type: "UPDATE_POST_LIKES",
        payload: {
          postId: post.id,
          increment: updatedLike.action === "like" ? 1 : -1,
        },
      });
    };

    socket.on("likeUpdated", updateLikeState);

    return () => {
      socket.off("likeUpdated", updateLikeState);
    };
  }, [socket, post?.id, dispatch]);

  const handleLike = async () => {
    const newLikedState = !post.liked_by_me;
    const increment = newLikedState ? 1 : -1;

    // Optimistic update for immediate UI feedback
    setOptimisticUpdate({
      liked_by_me: newLikedState,
      like_count_change: increment,
    });

    try {
      const response = await xcloneApi.post(
        postRequests.likePost(post.id),
        {},
        {
          headers: {
            Authorization: `Bearer ${appState.user.token}`,
          },
        }
      );

      // Don't dispatch local update - wait for socket to reconcile
    } catch (error) {
      setOptimisticUpdate(null);
    }
  };

  // Calculate display values with optimistic updates
  const displayLikedByMe = optimisticUpdate
    ? optimisticUpdate.liked_by_me
    : post.liked_by_me;
  const displayLikeCount = optimisticUpdate
    ? post.like_count + optimisticUpdate.like_count_change
    : post.like_count;
  return (
    <div
      className={className}
      onClick={handleLike}
      style={{
        color: displayLikedByMe ? "var(--accent-red)" : "inherit",
      }}
    >
      <i className="fas fa-heart"></i>
      <span>{displayLikeCount}</span>
    </div>
  );
};

export default PostLikeComponent;
