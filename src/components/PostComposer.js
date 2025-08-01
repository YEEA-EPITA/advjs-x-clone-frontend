import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../styles/PostComposer.css';
import { createPost } from '../store/postSlice';
import LoaderBar from './LoaderBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faGlobe, faImage, faChartBar, faSmile, faCalendar, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const schema = yup.object().shape({
  poll: yup.object().shape({
    question: yup.string().max(255, 'Question must be less than 255 characters.'),
    options: yup.array().of(yup.string().max(255, 'Option must be less than 255 characters.')),
  }),
});

const PostComposer = ({ onClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const audienceOptions = ['Everyone', 'Followers', 'Only Me'];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      content: '',
      poll: {
        question: '',
        options: ['', ''],
        duration: { days: 1, hours: 0, minutes: 0 },
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'poll.options',
  });

  const watchPoll = watch('poll');
  const showPoll = !!watchPoll;
  const watchOptions = watch('poll.options');
  const content = watch('content');

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userEmail = user?.email || '';
  const userInitial = userEmail.charAt(0).toUpperCase();

  const [selectedAudience, setSelectedAudience] = React.useState('Everyone');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [mediaFile, setMediaFile] = React.useState(null);
  const [locationName, setLocationName] = React.useState('');
  const [isFetchingLocation, setIsFetchingLocation] = React.useState(false);

  const handleLocationClick = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');

    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`, {
            headers: { 'Accept-Language': 'en' },
          });
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.state;
          setLocationName(city || 'Unknown');
        } catch {
          setLocationName('Unknown');
        } finally {
          setIsFetchingLocation(false);
        }
      },
      () => {
        alert('Could not retrieve location');
        setIsFetchingLocation(false);
      }
    );
  };

  const onSubmit = async (data) => {
    const { content, poll } = data;

    let pollPayload;
    if (poll?.question && poll?.options?.filter((opt) => opt.trim()).length >= 2) {
      const expires = new Date();
      expires.setDate(expires.getDate() + Number(poll.duration.days || 0));
      expires.setHours(expires.getHours() + Number(poll.duration.hours || 0));
      expires.setMinutes(expires.getMinutes() + Number(poll.duration.minutes || 0));

      pollPayload = {
        question: poll.question.trim(),
        options: poll.options.filter((opt) => opt.trim()),
        expires_at: expires.toISOString(),
      };
    }

    try {
      await dispatch(createPost({
        content,
        mediaFile,
        location: locationName || 'Unknown',
        poll: pollPayload,
      }));

      onClose?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="composer-overlay">
      <div className="composer-modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="draft-link">Drafts</div>

        <div className="profile-row">
          <div className="profile-placeholder">{userInitial}</div>
          <div className="audience-wrapper">
            <button className="audience-toggle" onClick={() => setShowDropdown(!showDropdown)}>
              {selectedAudience} ▼
            </button>
            {showDropdown && (
              <ul className="audience-dropdown">
                {audienceOptions.map((opt) => (
                  <li key={opt} onClick={() => { setSelectedAudience(opt); setShowDropdown(false); }}>{opt}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            className="composer-textarea"
            placeholder="What’s happening?"
            {...register('content')}
          />
          {errors.content && <p className="error-text">{errors.content.message}</p>}

          {locationName && <div className="location-display">📍 {locationName}</div>}

          {showPoll && (
            <div className="poll-section">
              <label className="poll-label">Ask a question</label>
              <input
                type="text"
                className="poll-input"
                placeholder="e.g., What's your favorite book?"
                {...register('poll.question')}
              />
              {errors.poll?.question && <p className="error-text">{errors.poll.question.message}</p>}

              {fields.map((field, index) => (
                <div key={field.id} className="poll-option-row">
                  <input
                    type="text"
                    placeholder={`Choice ${index + 1}`}
                    className="poll-input"
                    {...register(`poll.options.${index}`)}
                  />
                  {watchOptions.length > 2 && (
                    <button type="button" className="poll-delete-btn" onClick={() => remove(index)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                  {errors.poll?.options?.[index] && (
                    <p className="error-text">{errors.poll.options[index].message}</p>
                  )}
                </div>
              ))}

              {watchOptions.length < 4 && (
                <button type="button" className="poll-add-btn" onClick={() => append('')}>
                  + Add option
                </button>
              )}

              <div className="poll-duration">
                <label className="poll-label">Poll length</label>
                <div className="poll-duration-grid">
                  {['days', 'hours', 'minutes'].map((unit) => (
                    <div key={unit} className="poll-duration-item">
                      <label>{unit.charAt(0).toUpperCase() + unit.slice(1)}</label>
                      <input
                        type="number"
                        min="0"
                        {...register(`poll.duration.${unit}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="poll-remove-btn"
                onClick={() => {
                  setValue('poll.question', '');
                  setValue('poll.options', ['', '']);
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
              <FontAwesomeIcon icon={faChartBar} className="icon" onClick={() => setValue('poll.question', '')} />
              <FontAwesomeIcon icon={faSmile} className="icon" />
              <FontAwesomeIcon icon={faCalendar} className="icon" />
              <FontAwesomeIcon icon={faLocationDot} className="icon" onClick={handleLocationClick} />
            </div>
            <button className="submit-btn" type="submit" disabled={isSubmitting || isFetchingLocation}>
              Post
            </button>
          </div>
          {isSubmitting && <LoaderBar />}
        </form>
      </div>
    </div>
  );
};

export default PostComposer;
