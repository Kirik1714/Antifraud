import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import styles from "./LoginPage.module.scss";
import { useLoginMutation } from "../authSlice";
 
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [customError, setCustomError] = useState("");

  const navigate = useNavigate();

  const [loginTrigger, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCustomError("");
    if (password.length < 8) {
      setCustomError("Password must be at least 8 characters long");
      return;
    }

    try {
      await loginTrigger({ username, password }).unwrap();

      navigate("/clients");
    } catch (err) {
      console.error("Ошибка авторизации:", err);
      setCustomError(err?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Login to Your Account</h2>
        <p>Secure login to manage antifraud system</p>

        {customError && (
          <div className={styles.errorMessage}>{customError}</div>
        )}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <User className={styles.fieldIcon} size={18} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.fieldIcon} size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          <div className={styles.forgotPassword}>
            <a href="#">Forgot Password?</a>
          </div>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.authFooter}>
          Don't have an account?
          <Link to="/register">Register Now</Link>
        </div>
      </div>
    </div>
  );
}
