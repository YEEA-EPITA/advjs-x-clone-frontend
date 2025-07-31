import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { xcloneApi } from "../constants/axios";
import { userRequests } from "../constants/requests";
import { useNavigate } from "react-router-dom";
import useAppStateContext from "../hooks/useAppStateContext";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginForm = () => {
  const { dispatch } = useAppStateContext();
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const togglePassword = (e) => {
    e.preventDefault();
    setShowPass((prev) => !prev);
  };

  const onSubmit = async ({ email, password }) => {
    try {
      const res = await xcloneApi.post(userRequests.login, { email, password });
      
      console.log('Login response:', res.data); // Debug log
      
      // Store the complete user data with token
      const userData = {
        token: res.data.token || res.data.body?.token, // Handle different response structures
        email,
        username: res.data.username || res.data.body?.username,
        userId: res.data.userId || res.data.body?.userId,
        isAuthenticated: true
      };
      
      // Store in localStorage directly
      localStorage.setItem("user", JSON.stringify(userData));

      dispatch({
        type: "Login",
        payload: userData,
      });

      navigate("/home");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        placeholder="Email"
        className="modal-input"
        {...register("email")}
      />
      {errors.email && <p className="modal-message">{errors.email.message}</p>}

      <div className="modal-password-wrapper">
        <input
          type={showPass ? "text" : "password"}
          placeholder="Password"
          className="modal-input"
          {...register("password")}
        />
        <span onClick={togglePassword} className="modal-eye">
          <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} />
        </span>
      </div>
      {errors.password && <p className="modal-message">{errors.password.message}</p>}

      {message && <p className="modal-message">{message}</p>}

      <button type="submit" className="modal-submit">
        Submit
      </button>
    </form>
  );
};

export default LoginForm;
