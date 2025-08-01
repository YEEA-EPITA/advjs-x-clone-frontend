import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/PostComposer.css';
import { createPost } from '../store/postSlice'; 
import LoaderBar from './LoaderBar';
import {
  faGlobe,
  faImage,
  faChartBar,
  faSmile,
  faCalendar,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';

const PostComposer = ({ onClose }) => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState('Everyone');
  const [isPosting, setIsPosting] = useState(false);
  const audienceOptions = ['Everyone', 'Followers', 'Only Me'];
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleSelect = (option) => {
    setSelectedAudience(option);
    setShowDropdown(false);
  };

  const handlePost = async () => {
    if (!content.trim()) return alert("What’s happening?");
    setIsPosting(true);

    const formData = new FormData();
    formData.append('content', content);
    if (mediaFile) formData.append('media', mediaFile);
    formData.append('location', 'Paris');

    try {
      await dispatch(createPost({ content, mediaFile, location: 'Paris' }));
      setContent('');
      setMediaFile(null);
      onClose?.();
    } catch (err) {
      console.error('Post failed', err);
    } finally {
      setIsPosting(false);
    }
};


  return (
    <div className="composer-modal">
      <button className="close-btn" onClick={onClose}>✕</button>
      <div className="draft-link">Drafts</div>

      <div className="profile-row">
        <div className="profile-placeholder">YW</div>
        <div className="audience-wrapper">
          <button
            className="audience-toggle"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedAudience} ▼
          </button>

          {showDropdown && (
            <ul className="audience-dropdown">
              {audienceOptions.map((option) => (
                <li key={option} onClick={() => handleSelect(option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <textarea
        className="composer-textarea"
        placeholder="What’s happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="reply-status">
        <FontAwesomeIcon icon={faGlobe} />
        {selectedAudience} can reply
      </div>

      <div className="composer-footer">
        <div className="icons">
      
          <label
            htmlFor="image-upload"
            className="icon-label"
            onClick={() => fileInputRef.current?.click()}
          >
            <FontAwesomeIcon icon={faImage} className="icon" />
          </label>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setMediaFile(e.target.files[0])}
            style={{ display: 'none' }}
          />

          <FontAwesomeIcon icon={faChartBar} className="icon" />
          <FontAwesomeIcon icon={faSmile} className="icon" />
          <FontAwesomeIcon icon={faCalendar} className="icon" />
          <FontAwesomeIcon icon={faLocationDot} className="icon" />
        </div>
        <button className="submit-btn" onClick={handlePost}>Post</button>
      </div>
      {isPosting && <LoaderBar />}
    </div>    
  );
};

export default PostComposer;
