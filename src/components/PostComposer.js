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
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const audienceOptions = ['Everyone', 'Followers', 'Only Me'];
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleSelect = (option) => {
    setSelectedAudience(option);
    setShowDropdown(false);
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                'Accept-Language': 'en' 
              }
            }
          );  

          const data = await res.json();

          const city =
            data.address.city || data.address.town || data.address.village || data.address.state;
          
          setLocation(`${latitude},${longitude}`); 
          setLocationName(city || 'Unknown location');
        } catch (error) {
          console.error('Error fetching city name:', error);
          setLocationName('Unknown');
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        alert('Failed to get your location');
        console.error(error);
        setIsFetchingLocation(false);
      }
    );
  };
  
   const handlePost = async () => {
    if (!content.trim()) return alert("What’s happening?");
    setIsPosting(true);

    try {
      await dispatch(
        createPost({
          content,
          mediaFile,
          location: locationName || 'Unknown',
        })
      );
      setContent('');
      setMediaFile(null);
      setLocation(null);
      setLocationName('');
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

      {locationName && (
        <div className="location-display">
          📍 {locationName}
        </div>
      )}

      <div className="reply-status">
        <FontAwesomeIcon icon={faGlobe} />
        {selectedAudience} can reply
      </div>

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
        <button className="submit-btn" onClick={handlePost}>Post</button>
      </div>
      {isPosting && <LoaderBar />}
    </div>    
  );
};

export default PostComposer;
