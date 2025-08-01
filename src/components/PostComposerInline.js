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

  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState({ days: 1, hours: 0, minutes: 0 });

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const audienceOptions = ['Everyone', 'Followers', 'Only Me'];

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
        } catch {
          setLocationName('Unknown');
        } finally {
          setIsFetchingLocation(false);
        }
      },
      () => {
        console.error('Location error');
        setIsFetchingLocation(false);
      }
    );
  };

  const handlePost = async () => {
    if (!content.trim()) return;

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

      await dispatch(createPost({
        content,
        mediaFile,
        location: locationName || 'Unknown',
        poll: pollPayload
      }));

      setContent('');
      setMediaFile(null);
      setLocationName('');
      setShowPoll(false);
      setPollOptions(['', '']);
      setPollQuestion('');
    } catch {}
    finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="composer-inline">
      <div className="profile-placeholder">{userInitial || 'U'}</div>
      <div className="composer-body">
        <div className="audience-wrapper">
          <button className="audience-toggle" onClick={() => setShowDropdown(!showDropdown)}>
            {selectedAudience} ▼
          </button>
          {showDropdown && (
            <ul className="audience-dropdown">
              {audienceOptions.map(option => (
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
              <div key={idx} className="poll-option-wrapper">
                <input
                  type="text"
                  placeholder={`Choice ${idx + 1}`}
                  value={option}
                  onChange={(e) => {
                    const updated = [...pollOptions];
                    updated[idx] = e.target.value;
                    setPollOptions(updated);
                  }}
                  className="poll-input"
                />
                {pollOptions.length > 2 && (
                  <button
                    className="poll-delete-btn"
                    onClick={() => {
                      const updated = pollOptions.filter((_, i) => i !== idx);
                      setPollOptions(updated);
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 4 && (
              <button className="poll-add-btn" onClick={() => setPollOptions([...pollOptions, ''])}>
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
              <button className="poll-remove-btn" onClick={() => {
                setShowPoll(false);
                setPollOptions(['', '']);
                setPollQuestion('');
              }}>
                Remove poll
              </button>
            </div>
          </div>
        )}

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
            <FontAwesomeIcon icon={faChartBar} className="icon" onClick={() => setShowPoll(!showPoll)} />
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
