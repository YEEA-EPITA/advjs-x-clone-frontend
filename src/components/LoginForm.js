import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { xcloneApi } from "../constants/axios";
import { userRequests } from "../constants/requests";
import { useNavigate } from "react-router-dom";
import useAppStateContext from "../hooks/useAppStateContext";

const LoginForm = () => {
  const { dispatch } = useAppStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const togglePassword = (e) => {
    e.preventDefault();
    setShowPass((prev) => !prev);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill all required fields");
      return;
    }

    xcloneApi
      .post(userRequests.login, { email, password })
      .then((res) => {
        dispatch({
          type: "Login",
          payload: {
            token: res.data.token,
            email,
            username: res.data.username,
          },
        });
        navigate("/home");
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Login failed");
      });
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        className="modal-input"
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="modal-password-wrapper">
        <input
          type={showPass ? "text" : "password"}
          placeholder="Password"
          className="modal-input"
          onChange={(e) => setPassword(e.target.value)}
        />
        <span onClick={togglePassword} className="modal-eye">
          <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} />
        </span>
      </div>

      {message && (
        <p className="modal-message">{message}</p>
      )}

      <button type="submit" className="modal-submit">
        Submit
      </button>
    </form>
  );
};

export default LoginForm;
