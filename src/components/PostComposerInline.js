import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../store/postSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoaderBar from './LoaderBar';
import {
  faGlobe, faImage, faChartBar,
  faSmile, faCalendar, faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import '../styles/PostComposer.css';

const PostComposerInline = () => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('Everyone');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const audienceOptions = ['Everyone', 'Followers', 'Only Me'];

  // const user = JSON.parse(localStorage.getItem('user'));
  // const userName = user?.name || '';
  // const userInitial = userName.charAt(0).toUpperCase();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userEmail = user?.email || '';
  const userInitial = userEmail.charAt(0).toUpperCase();


  const handleSelectAudience = (option) => {
    setSelectedAudience(option);
    setShowDropdown(false);
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported');
      return;
    }

    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.state;
          setLocationName(city || 'Unknown location');
        } catch (err) {
          setLocationName('Unknown');
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (err) => {
        console.error('Location error', err);
        setIsFetchingLocation(false);
      }
    );
  };

  const handlePost = async () => {
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      await dispatch(createPost({
        content,
        mediaFile,
        location: locationName || 'Unknown'
      }));
      setContent('');
      setMediaFile(null);
      setLocationName('');
    } catch (err) {
      console.error('Post failed', err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="composer-inline">
      <div className="profile-placeholder">{userInitial || 'U'}</div>
      <div className="composer-body">
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
                <li key={option} onClick={() => handleSelectAudience(option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}
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

        {locationName && (
          <div className="location-display">📍 {locationName}</div>
        )}

        <div className="composer-footer">
          <div className="icons">
            <label htmlFor="image-upload" className="icon-label">
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
            <FontAwesomeIcon icon={faLocationDot} className="icon" onClick={handleLocationClick} />
          </div>
          <button
            className="submit-btn"
            onClick={handlePost}
            disabled={isPosting || isFetchingLocation}
          >
            Post
          </button>
        </div>

        {isPosting && <LoaderBar />}
      </div>
    </div>
  );
};

export default PostComposerInline;
