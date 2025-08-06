import React, { useState } from "react";
import axios from "../constants/axios";


const RetweetComponent = ({ postId, initialRetweeted = false, initialCount = 0, onRetweet, onUnretweet, onSuccess, onCancel }) => {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [retweeted, setRetweeted] = useState(initialRetweeted);
    const [retweetCount, setRetweetCount] = useState(initialCount);

    const handleRetweet = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            if (!retweeted) {
                await axios.post(`/posts/${postId}/retweet`, { comment });
                setSuccess("Retweeted successfully!");
                setRetweeted(true);
                setRetweetCount(retweetCount + 1);
                if (onRetweet) onRetweet();
            } else {
                await axios.delete(`/posts/${postId}/retweet`);
                setSuccess("Retweet removed.");
                setRetweeted(false);
                setRetweetCount(Math.max(0, retweetCount - 1));
                if (onUnretweet) onUnretweet();
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to retweet");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="retweet-form" onSubmit={handleRetweet}>
            <label>
                Add a comment (optional):
                <textarea
                    name="comment"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add a comment to your retweet..."
                    disabled={retweeted}
                />
            </label>
            <button type="submit" disabled={loading}>{loading ? (retweeted ? "Removing..." : "Retweeting...") : (retweeted ? "Undo Retweet" : "Retweet")}</button>
            <span style={{ marginLeft: 12 }}><i className="fas fa-retweet"></i> {retweetCount}</span>
            {onCancel && (
                <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
            )}
            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}
        </form>
    );
};

export default RetweetComponent;
