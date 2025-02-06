import React, { useState } from "react";
import "../Styles/LoginPage.css";
import image from "../Assets/HomePage.png";
import { useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseURL, supabaseAnonKey);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (emailValue && !emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };
  
  const handleHomeClick = () => {
    navigate("/"); // Redirect to Login page
  };

  const handleResetPassword = async () => {
    if (!email || emailError) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage("If this email is registered, you will receive password reset instructions.");
    } catch (error) {
      setEmailError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-grid">
      <div className="form-container">
        <h2>Enter your email to receive a password reset link</h2>
        <br></br>
        <form>
          <input
            type="email"
            id="email"
            placeholder="user@someemail.com"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {emailError && <p className="error-message">{emailError}</p>}
          {message && <p className="success-message">{message}</p>}
          <button
            type="button"
            className="btn-primary"
            onClick={handleResetPassword}
            disabled={!email || emailError}
          >
            SEND RESET LINK
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleHomeClick}          >
            BACK TO LOGIN
          </button>
        </form>
      </div>
      <div className="image-container">
        <img src={image} alt="Security illustration" />
      </div>
    </div>
  );
};

export default ForgotPassword;
