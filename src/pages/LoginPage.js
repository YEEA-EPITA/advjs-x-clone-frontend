import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import '../styles/LoginPage.css';
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useTheme } from "../context/ThemeContext";


const LoginPage = () => {
    // Controls which form (Login, register) visible
    const [registerFormStatus, setRegistrationFormStatus] = useState(false);

    const { theme, toggleTheme } = useTheme(); 

    // Login form - sliding animation
    const loginProps = useSpring({
        left: registerFormStatus ? -600 : 0,
    });

    // Register form - sliding animation
    const registerProps = useSpring({
        left: registerFormStatus ? 0 : 600,
    });

    // Login button - border animation
    const loginButtonProps = useSpring({
        bordeBottom: registerFormStatus ? "solid 0px transparent" : "solid 2px white"
    });

    // Register button - border animation
    const registerButtonProps = useSpring({
        bordeBottom: registerFormStatus ? "solid 2px white" : "solid 0px transparent"
    });

    // Show login form when "Login" button is clicked
    const loginClicked = () => {
        setRegistrationFormStatus(false)
    }
    
     // Show register form when "Register" button is clicked
    const registerClicked = () => {
        setRegistrationFormStatus(true)
    }

    return (
        <div className={`container ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
        {/* // <div className="container"> */}
            <div className="login-wrapper">
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === "light" ? "🌙 Dark" : "☀️ Light"} Mode
                </button>
                {/* toggle buttons */}
                <div className="nav-buttons">
                    <animated.button id="loginButton" onClick={loginClicked} style={loginButtonProps}>
                        Login
                    </animated.button>
                    <animated.button id="loginButton" onClick={registerClicked} style={registerButtonProps}>
                        Register
                    </animated.button>
                </div>

                {/* Animated form container */}
                <div className="form-group">
                    <animated.form action="" id="loginform" style={loginProps}> 
                        <LoginForm />
                    </animated.form>
                    <animated.form action="" id="registerform" style={registerProps}>
                        <RegisterForm />
                    </animated.form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;