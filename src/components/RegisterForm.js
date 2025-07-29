import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { xcloneApi } from '../constants/axios';
import { userRequests } from '../constants/requests';
import '../styles/RegisterForm.css';

const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [message, setMessage] = useState([]);
  const [user, setUser] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    confirmPassword: ""
  });

  const togglePassword = (e) => {
    e.preventDefault();
    setShowPass(!showPass);
  };

  const toggleConfirmPassword = (e) => {
    e.preventDefault();
    setShowConfirmPass(!showConfirmPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setMessage(["Passwords do not match."]);
      return;
    }

    const { email, username, password, displayName } = user;
    const payload = { email, username, password, displayName };

    try {
      const res = await xcloneApi.post(userRequests.register, payload);
      if (res.status === 200) {
        setMessage(["Successfully Registered."]);
        setUser({ email: "", username: "", displayName: "", password: "", confirmPassword: "" });
      } else {
        setMessage(["Registration failed."]);
      }
    } catch (err) {
      const validationErrors = err?.response?.data?.errors;
      if (Array.isArray(validationErrors)) {
        setMessage(validationErrors.map(err => err.message));
      } else {
        const fallback = err?.response?.data?.message || "Server error.";
        setMessage([fallback]);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {["email", "username", "displayName"].map((field) => (
        <div className="form-group" key={field}>
          <input
            type="text"
            id={field}
            className="floating-input"
            value={user[field]}
            onChange={(e) => setUser({ ...user, [field]: e.target.value })}
            placeholder=" "
            required
          />
          <label htmlFor={field}>{field === "displayName" ? "Display Name" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
        </div>
      ))}

      <div className="form-group password-group">
        <input
          type={showPass ? "text" : "password"}
          id="password"
          className="floating-input"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder=" "
          required
        />
        <label htmlFor="password">Password</label>
        <span className="toggle-icon" onClick={togglePassword}>
          <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} />
        </span>
      </div>

      <div className="form-group password-group">
        <input
          type={showConfirmPass ? "text" : "password"}
          id="confirmPassword"
          className="floating-input"
          value={user.confirmPassword}
          onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
          placeholder=" "
          required
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <span className="toggle-icon" onClick={toggleConfirmPassword}>
          <FontAwesomeIcon icon={showConfirmPass ? faEye : faEyeSlash} />
        </span>
      </div>

      <button type="submit" className="submit-btn">Submit</button>

      {message.length > 0 && (
        <div className="message-area">
          {message.map((msg, i) => (
            <div key={i}>• {msg}</div>
          ))}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
