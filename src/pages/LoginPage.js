import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import '../styles/LoginPage.css';
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="container">
      <div className="logo-section">
        <img src="/assets/x-logo.png" alt="X Logo" className="x-logo" />
      </div>

      <div className="auth-section">
        <h1 className="title">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage; 