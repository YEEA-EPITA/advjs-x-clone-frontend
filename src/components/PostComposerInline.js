import React, { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoaderBar from "./LoaderBar";
import {
  faGlobe,
  faImage,
  faChartBar,
  faSmile,
  faCalendar,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/PostComposer.css";
import useAppStateContext from "../hooks/useAppStateContext";
import { xcloneApi } from "../constants/axios";
import { postRequests } from "../constants/requests";
import { transformedPosts } from "../utils/generalFunctions";

const schema = yup.object().shape({
  poll: yup.object().shape({
    question: yup
      .string()
      .max(255, "Question must be less than 255 characters."),
    options: yup
      .array()
      .of(yup.string().max(255, "Option must be less than 255 characters.")),
  }),
});

const extractTags = (text = "") => {
  const hashtagRe = /#([\p{L}\p{N}_]+)\b/gu;
  const mentionRe = /@([A-Za-z0-9_]+)\b/g;

  const hashtags = new Set();
  const mentions = new Set();

  let m;
  while ((m = hashtagRe.exec(text))) hashtags.add(m[1].toLowerCase());
  while ((m = mentionRe.exec(text))) mentions.add(m[1]);

  return { hashtags: [...hashtags], mentions: [...mentions] };
};

const PostComposerInline = () => {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("Everyone");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const { appState, dispatch } = useAppStateContext();

  const socket = appState?.socket;

  const [showPoll, setShowPoll] = useState(false);
  const [pollDuration, setPollDuration] = useState({
    days: 1,
    hours: 0,
    minutes: 0,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      poll: {
        question: "",
        options: ["", ""],
      },
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "poll.options",
  });

  const fileInputRef = useRef(null);
  const audienceOptions = ["Everyone", "Followers", "Only Me"];

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userEmail = user?.email || "";
  const userInitial = userEmail.charAt(0).toUpperCase();

  const handleSelectAudience = (option) => {
    setSelectedAudience(option);
    setShowDropdown(false);
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state;
          setLocationName(city || "Unknown location");
        } catch {
          setLocationName("Unknown");
        } finally {
          setIsFetchingLocation(false);
        }
      },
      () => {
        console.error("Location error");
        setIsFetchingLocation(false);
      }
    );
  };

  const onSubmit = async (payload) => {
    if (!content.trim()) return;

    setIsPosting(true);

    try {
      let pollPayload;
      if (showPoll) {
        const options = payload.poll.options.filter((opt) => opt.trim());
        if (payload.poll.question.trim() && options.length >= 2) {
          const expires = new Date();
          expires.setDate(expires.getDate() + Number(pollDuration.days || 0));
          expires.setHours(
            expires.getHours() + Number(pollDuration.hours || 0)
          );
          expires.setMinutes(
            expires.getMinutes() + Number(pollDuration.minutes || 0)
          );
          pollPayload = {
            question: payload.poll.question.trim(),
            options,
            expires_at: expires.toISOString(),
          };
        }
      }

      const { hashtags, mentions } = extractTags(content || "");
      const location = locationName || "Unknown";
      const poll = pollPayload || null;

      const formData = new FormData();
      formData.append("content", content);
      if (mediaFile) formData.append("media", mediaFile);
      formData.append("location", location);
      if (poll) formData.append("poll", JSON.stringify(poll));
      if (hashtags?.length)
        formData.append("hashtags", JSON.stringify(hashtags));
      if (mentions?.length)
        formData.append("mentions", JSON.stringify(mentions));
      const res = await xcloneApi.post(postRequests.createPost, formData);

      setContent("");
      setMediaFile(null);
      setLocationName("");
      reset();
      setShowPoll(false);
    } catch {
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket?.on("new_feed", (data) => {
      if (!data) return;

      dispatch({
        type: "UPDATE_POST_LIST_AFTER_CREATE",
        payload: transformedPosts(data),
      });
    });

    return () => {
      socket?.off("new_feed");
    };
  }, [socket]);

  return (
    <div className="composer-inline">
      <div className="profile-placeholder">{userInitial || "U"}</div>
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

        {mediaFile && (
          <div className="media-preview">
            <img
              src={URL.createObjectURL(mediaFile)}
              alt="Uploaded preview"
              className="uploaded-image"
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {showPoll && (
            <div className="poll-section">
              <label className="poll-label">Ask a question</label>
              <input
                type="text"
                className="poll-input"
                placeholder="e.g., What's your favorite book?"
                {...register("poll.question")}
              />
              {errors.poll?.question && (
                <p className="error-text">{errors.poll.question.message}</p>
              )}

              {fields.map((field, idx) => (
                <div key={field.id} className="poll-option-wrapper">
                  <input
                    type="text"
                    placeholder={`Choice ${idx + 1}`}
                    {...register(`poll.options.${idx}`)}
                    className="poll-input"
                  />
                  {fields.length > 2 && (
                    <button
                      type="button"
                      className="poll-delete-btn"
                      onClick={() => remove(idx)}
                    >
                      ✕
                    </button>
                  )}
                  {errors.poll?.options?.[idx] && (
                    <p className="error-text">
                      {errors.poll.options[idx]?.message}
                    </p>
                  )}
                </div>
              ))}

              {fields.length < 4 && (
                <button
                  type="button"
                  className="poll-add-btn"
                  onClick={() => append("")}
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
                      onChange={(e) =>
                        setPollDuration({
                          ...pollDuration,
                          days: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="poll-duration-item">
                    <label>Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={pollDuration.hours}
                      onChange={(e) =>
                        setPollDuration({
                          ...pollDuration,
                          hours: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="poll-duration-item">
                    <label>Minutes</label>
                    <input
                      type="number"
                      min="0"
                      value={pollDuration.minutes}
                      onChange={(e) =>
                        setPollDuration({
                          ...pollDuration,
                          minutes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="poll-remove-btn"
                  onClick={() => {
                    setShowPoll(false);
                    reset();
                  }}
                >
                  Remove poll
                </button>
              </div>
            </div>
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
                style={{ display: "none" }}
              />
              <FontAwesomeIcon
                icon={faChartBar}
                className="icon"
                onClick={() => setShowPoll((prev) => !prev)}
              />
              <FontAwesomeIcon icon={faSmile} className="icon" />
              <FontAwesomeIcon icon={faCalendar} className="icon" />
              <FontAwesomeIcon
                icon={faLocationDot}
                className="icon"
                onClick={handleLocationClick}
              />
            </div>
            <button
              className="submit-btn"
              type="submit"
              disabled={content.length < 1 || isPosting || isFetchingLocation}
            >
              Post
            </button>
          </div>
        </form>

        {locationName && (
          <div className="location-display">📍 {locationName}</div>
        )}
        {isPosting && <LoaderBar />}
      </div>
    </div>
  );
};

export default PostComposerInline;
