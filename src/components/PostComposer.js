import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../store/postSlice';

export default function PostComposer({ onClose }) {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append('content', content);
    if (mediaFile) formData.append('media', mediaFile);
    formData.append('location', 'Paris');  // TODO: Replace with actual location input

    dispatch(createPost({ content, mediaFile, location: 'Paris'}));
    setContent('');
    setMediaFile(null);
    onClose?.();
  };


  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
      />
      <input type="file" onChange={(e) => setMediaFile(e.target.files[0])} />
      <button onClick={handleSubmit}>Post</button>
    </div>
  );
}
