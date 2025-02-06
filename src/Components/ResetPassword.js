import React, { useState } from "react";
import "../Styles/LoginPage.css";
import image from "../Assets/HomePage.png";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient.js";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [serverError, setServerError] = useState("");

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError("");
    }

    if (newPassword !== verifyPassword) {
      setPasswordMatchError("Passwords do not match.");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleVerifyPasswordChange = (e) => {
    const newVerifyPassword = e.target.value;
    setVerifyPassword(newVerifyPassword);

    if (password !== newVerifyPassword) {
      setPasswordMatchError("Passwords do not match.");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleResetPassword = async () => {
    if (!password || password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== verifyPassword) {
      setPasswordMatchError("Passwords do not match.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setShowPopup(true);
    } catch (error) {
      setServerError("Something went wrong. Please try again later.");
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="login-grid">
      <div className="form-container">
        <h2>Reset Your Password</h2>
        <br />
        <form>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {passwordError && <p className="error-message">{passwordError}</p>}

          <input
            type="password"
            placeholder="Confirm new password"
            value={verifyPassword}
            onChange={handleVerifyPasswordChange}
            required
          />
          {passwordMatchError && (
            <p className="error-message">{passwordMatchError}</p>
          )}

          {serverError && <p className="error-message">{serverError}</p>}

          <button
            type="button"
            className="btn-primary"
            onClick={handleResetPassword}
            disabled={!password || !verifyPassword || passwordError || passwordMatchError}
          >
            RESET PASSWORD
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleHomeClick}
          >
            BACK TO LOGIN
          </button>
        </form>
      </div>
      <div className="image-container">
        <img src={image} alt="Security illustration" />
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Your password has successfully been updated.</p>
            <button onClick={handlePopupClose}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;