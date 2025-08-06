import React, { useState, useEffect } from "react";
import axios from "../constants/axios";

const RepliesSection = ({ postId }) => {
    const [replies, setReplies] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReplies();
        // eslint-disable-next-line
    }, [postId]);

    const fetchReplies = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`/posts/${postId}/replies`);
            setReplies(res.data.replies || []);
        } catch (err) {
            setError("Failed to load replies");
        } finally {
            setLoading(false);
        }
    };

    const handleAddReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setLoading(true);
        setError("");
        try {
            await axios.post(`/posts/${postId}/replies`, { content: replyText });
            setReplyText("");
            fetchReplies();
        } catch (err) {
            setError("Failed to add reply");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="replies-section" style={{ marginTop: 16 }}>
            <h4>Replies</h4>
            <form onSubmit={handleAddReply} style={{ marginBottom: 8 }}>
                <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    style={{ width: '80%' }}
                />
                <button type="submit" disabled={loading || !replyText.trim()} style={{ marginLeft: 8 }}>Reply</button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {loading && <div>Loading...</div>}
            <ul style={{ paddingLeft: 0 }}>
                {replies.map(r => (
                    <li key={r._id} style={{ listStyle: 'none', marginBottom: 6 }}>
                        <b>@{r.username || r.user?.username || 'user'}:</b> {r.content}
                        <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RepliesSection;
