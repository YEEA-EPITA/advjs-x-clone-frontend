import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/PostComposer.css';
import { createPost } from '../store/postSlice'; 
import LoaderBar from './LoaderBar';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState({ days: 1, hours: 0, minutes: 0 });

  const audienceOptions = ['Everyone', 'Followers', 'Only Me'];
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userEmail = user?.email || '';
  const userInitial = userEmail.charAt(0).toUpperCase();

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
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.state;
          setLocation(`${latitude},${longitude}`);
          setLocationName(city || 'Unknown location');
        } catch (error) {
          setLocationName('Unknown');
        } finally {
          setIsFetchingLocation(false);
        }
      },
      () => {
        alert('Failed to get your location');
        setIsFetchingLocation(false);
      }
    );
  };

  const handlePost = async () => {
    if (!content.trim()) return alert("What’s happening?");
    setIsPosting(true);

    try {
      let pollPayload;
      if (showPoll) {
        const options = pollOptions.filter(opt => opt.trim());
        if (pollQuestion.trim() && options.length >= 2) {
          const expires = new Date();
          expires.setDate(expires.getDate() + Number(pollDuration.days || 0));
          expires.setHours(expires.getHours() + Number(pollDuration.hours || 0));
          expires.setMinutes(expires.getMinutes() + Number(pollDuration.minutes || 0));
          pollPayload = {
            question: pollQuestion.trim(),
            options,
            expires_at: expires.toISOString(),
          };
        }
      }

      await dispatch(
        createPost({
          content,
          mediaFile,
          location: locationName || 'Unknown',
          poll: pollPayload,
        })
      );

      setContent('');
      setMediaFile(null);
      setLocation(null);
      setLocationName('');
      setPollOptions(['', '']);
      setPollQuestion('');
      setShowPoll(false);
      onClose?.();
    } catch (err) {
      console.error('Post failed:', err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="composer-overlay">
      <div className="composer-modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="draft-link">Drafts</div>

        <div className="profile-row">
          <div className="profile-placeholder">{userInitial || 'U'}</div>
          <div className="audience-wrapper">
            <button className="audience-toggle" onClick={() => setShowDropdown(!showDropdown)}>
              {selectedAudience} ▼
            </button>
            {showDropdown && (
              <ul className="audience-dropdown">
                {audienceOptions.map(option => (
                  <li key={option} onClick={() => handleSelect(option)}>{option}</li>
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

        {locationName && <div className="location-display">📍 {locationName}</div>}

        {showPoll && (
          <div className="poll-section">
            <label className="poll-label">Ask a question</label>
            <input
              type="text"
              className="poll-input"
              placeholder="e.g., What's your favorite framework?"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
            />
            
            {pollOptions.map((option, idx) => (
              <div key={idx} className="poll-option-row">
                <input
                  type="text"
                  placeholder={`Choice ${idx + 1}`}
                  value={option}
                  className="poll-input"
                  onChange={(e) => {
                    const updated = [...pollOptions];
                    updated[idx] = e.target.value;
                    setPollOptions(updated);
                  }}
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    className="poll-delete-btn"
                    onClick={() => {
                      const updated = [...pollOptions];
                      updated.splice(idx, 1);
                      setPollOptions(updated);
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
            ))}

            {pollOptions.length < 4 && (
              <button
                className="poll-add-btn"
                onClick={() => setPollOptions([...pollOptions, ''])}
              >
                + Add option
              </button>
            )}

            <div className="poll-duration">
              <label className="poll-label">Poll length</label>
              <div className="poll-duration-grid">
                <div className="poll-duration-item">
                  <label>Days</label>
                  <input
                    type="number"
                    min="0"
                    value={pollDuration.days}
                    onChange={(e) => setPollDuration({ ...pollDuration, days: e.target.value })}
                  />
                </div>
                <div className="poll-duration-item">
                  <label>Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={pollDuration.hours}
                    onChange={(e) => setPollDuration({ ...pollDuration, hours: e.target.value })}
                  />
                </div>
                <div className="poll-duration-item">
                  <label>Minutes</label>
                  <input
                    type="number"
                    min="0"
                    value={pollDuration.minutes}
                    onChange={(e) => setPollDuration({ ...pollDuration, minutes: e.target.value })}
                  />
                </div>
              </div>
            </div>


            <button
              className="poll-remove-btn"
              onClick={() => {
                setShowPoll(false);
                setPollOptions(['', '']);
                setPollQuestion('');
              }}
            >
              Remove poll
            </button>
          </div>
        )}

        <div className="reply-status">
          <FontAwesomeIcon icon={faGlobe} />
          {selectedAudience} can reply
        </div>

        <div className="composer-footer">
          <div className="icons">
            <div className="icon-label" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faImage} className="icon" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setMediaFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <FontAwesomeIcon icon={faChartBar} className="icon" onClick={() => setShowPoll(!showPoll)} />
            <FontAwesomeIcon icon={faSmile} className="icon" />
            <FontAwesomeIcon icon={faCalendar} className="icon" />
            <FontAwesomeIcon icon={faLocationDot} className="icon" onClick={handleLocationClick} />
          </div>
          <button className="submit-btn" onClick={handlePost} disabled={isPosting || isFetchingLocation}>Post</button>
        </div>

        {isPosting && <LoaderBar />}
      </div>
    </div>
  );
};

export default PostComposer;
