import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ users, setCurrentUser }) => {
  const [userType, setUserType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Validate email domain for students only
    if (userType === 'student' && !trimmedEmail.endsWith('@mahindrauniversity.edu.in')) {
      setError('Please use your Mahindra University email address');
      return;
    }

    // Find matching user with correct userType
    const user = users.find(
      user => user.email === trimmedEmail && user.password === trimmedPassword && user.userType === userType
    );

    if (user) {
      setCurrentUser(user);
      navigate('/home'); // Navigate to home page
    } else {
      setError('Invalid credentials or user not signed up!');
    }
  };

  return (
    <div className="login-page">
      <div className="left-panel">
        <h1>MU Connect</h1>
        <p>Connect. Network. Grow.</p>
        <p>Exclusive for Mahindra University</p>
      </div>

      <div className="right-panel">
        <div className="glass-card">
          <h2>MU Connect</h2>
          <h3>Welcome Back</h3>
          {/* User type toggle */}
          <div className="user-type-toggle">
            <button
              type="button"
              className={userType === 'student' ? 'active' : ''}
              onClick={() => setUserType('student')}
            >
              Student
            </button>
            <button
              type="button"
              className={userType === 'alumni' ? 'active' : ''}
              onClick={() => setUserType('alumni')}
            >
              Alumni
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            <label>Email{userType === 'student' ? ' (@mahindrauniversity.edu.in)' : ''}</label>
            <input 
              type="email" 
              placeholder={userType === 'student' ? 'Enter your university email' : 'Enter your email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />

            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />

            <button type="submit">Log In</button>
          </form>
          <p className="signup-text">
            Don't have an account?{' '}
            <span
              className="signup-link"
              onClick={() => navigate('/signup')}
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
