import React, { useState } from "react";
import "../Styles/LoginPage.css";
import image from "../Assets/HomePage.png";
import { useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";

// Initiatlize Supabase Client
const supabaseURL = "https://kdzamdxnnnzodftvjcrh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkemFtZHhubm56b2RmdHZqY3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NzA5NzIsImV4cCI6MjA1MzI0Njk3Mn0.0Ml4p6x7VDY2m5_t2ISl0aEYpEum-vD8uFL1BYxBaes";
const supabase = createClient(supabaseURL, supabaseAnonKey);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = (e) => {
    const emailValue = e.target.value.toUpperCase(); // Convert to uppercase for storage
    setEmail(emailValue); // Store uppercase email
  
    if (emailValue && !emailRegex.test(emailValue.toLowerCase())) { // Validate in lowercase
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
      // Check if the email exists in the Users table
      const { data, error } = await supabase
        .from("Users") // Change to your actual table name
        .select("email")
        .eq("email", email)
        .single();
  
      if (error || !data) {
        setEmailError("This email is not registered. Please sign up.");
        return;
      }
  
      // Send the reset email (Supabase will use the default redirect URL)
      const { resetError } = await supabase.auth.resetPasswordForEmail(email);

  
      if (resetError) throw resetError;
  
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
          value={email.toLowerCase()} // Always display lowercase
          onChange={handleEmailChange} // Handle input change
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