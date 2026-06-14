import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from '../../../components/ui/Icons';
import styles from './RegisterPage.module.scss'; 
import { useRegisterMutation } from '../authSlice';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customError, setCustomError] = useState('');
 
const navigate = useNavigate();
const [registerTrigger, { isLoading }] = useRegisterMutation();
 const handleSubmit = async (e) => {
    e.preventDefault();
    setCustomError('');
    if (password.length < 8) {
    setCustomError('Password must be at least 8 characters long');
    return; 
  }

    try {
    
      await registerTrigger({
        firstName: fullName,
        email,
        username,
        password
      }).unwrap();

  
      navigate('/');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setCustomError(err?.data?.message || 'Something went wrong during registration');
    }
  };

 return (
    <main className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Create New Account</h2>
        <p>Register a new profile analyst</p>
        
        {customError && <div className={styles.errorMessage}>{customError}</div>}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <User className={styles.fieldIcon} size={18} />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <MailIcon className={styles.fieldIcon} size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <User className={styles.fieldIcon} size={18} />
            <input 
              type="text" 
              placeholder="Desired Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <LockIcon className={styles.fieldIcon} size={18} />
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
              aria-label={showPassword ? "Hide password" : "Show password"} 
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.authFooter}>
          Already have an account?
          <Link to="/login">Login here</Link>
        </div>
      </div>
    </main>
  );
}