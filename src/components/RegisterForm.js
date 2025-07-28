import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { xcloneApi } from '../constants/axios';
import { userRequests } from '../constants/requests';

export const RegisterForm = () => {
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

  const togglePassword = (event) => {
    event.preventDefault();
    setShowPass(!showPass);
  };

  const toggleConfirmPassword = (event) => {
    event.preventDefault();
    setShowConfirmPass(!showConfirmPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const { email, username, password, displayName } = user;

    const payload = {
      email,
      username,
      password,
      displayName  
    };

    try {
      const res = await xcloneApi.post(userRequests.register, payload);

      if (res.status === 200) {
        setMessage("Successfully Registered.");
        setUser({
          email: "",
          username: "",
          displayName: "",
          password: "",
          confirmPassword: ""
        });
      } else {
        setMessage("Registration failed.");
      }
    } catch (err) {
      //  const errorMsg = 
      //   err?.response?.data?.message ||
      //   err?.response?.data?.errors?.[0]?.message ||
      //   "Error connecting to server.";

      // setMessage(errorMsg);
      const validationErrors = err?.response?.data?.errors;

      if (Array.isArray(validationErrors)) {
        const allMessages = validationErrors.map(err => err.message);
        setMessage(allMessages); 
      } else {
        const fallbackMsg = err?.response?.data?.message || "Error connecting to server.";
        setMessage([fallbackMsg]);
      }
    }
  };

  return (
    <React.Fragment>
      <div className='inputs-container'>
        <div className='input-container'> 
          <label className='email'>Email</label>
          <input
            type='text'
            className='email'
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
      </div>

      <div className='input-container'> 
        <label>Username</label>
        <input
          type='text'
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
      </div>

      <div className='input-container'> 
        <label>Display Name</label>
        <input
          type='text'
          value={user.displayName}
          onChange={(e) => setUser({ ...user, displayName: e.target.value })}
        />
      </div>

      <div className='input-container' style={{ position: "relative" }}> 
        <label>Password</label>
        <input
          type={showPass ? "text" : "password"}
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <span onClick={togglePassword} style={{ cursor: "pointer" }}>
          {showPass ? (
            <FontAwesomeIcon icon={faEye} className='customIcon' />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} className='customIcon' />
          )}
        </span>
      </div>

      <div className='input-container' style={{ position: "relative" }}>
        <label>Confirm Password</label>
        <input
          type={showConfirmPass ? "text" : "password"}
          value={user.confirmPassword}
          onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
        />
        <span onClick={toggleConfirmPassword} style={{ cursor: "pointer" }}>
          {showConfirmPass ? (
            <FontAwesomeIcon icon={faEye} className='customIcon' />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} className='customIcon' />
          )}
        </span>
      </div>

      <button type="submit" className='submit' onClick={handleSubmit}>
        Submit
      </button>

      {/* <span style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {message}
      </span> */}
      {message.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {message.map((msg, i) => (
            <div key={i}>• {msg}</div>
          ))}
        </div>
      )}

    </React.Fragment>
  );
};

export default RegisterForm;
