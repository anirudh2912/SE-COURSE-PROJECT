import React, { useState } from 'react';
import './LoginForm.css'; // Reuse same styles as login
import { useNavigate } from 'react-router-dom';

const SignUpForm = ({ users, setUsers, onSignupSuccess }) => {
  const [userType, setUserType] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Validate domain for students only
    if (userType === 'student' && !trimmedEmail.endsWith('@mahindrauniversity.edu.in')) {
      setError('Students must use their Mahindra University email address');
      return;
    }

    // Check for existing user
    const exists = users.find(user => user.email === trimmedEmail);
    if (exists) {
      setError('User already signed up! Please login.');
      // Clear all user data
      localStorage.removeItem('mu-connect-current-user');
      localStorage.removeItem('mu-connect-users');
      setUsers([]);
    } else {
      const newUser = {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        userType
      };

      // Save user and redirect
      setUsers([...users, newUser]);
      alert('Signup successful! Please login.');

      if (onSignupSuccess) {
        onSignupSuccess(); // fallback if parent passed a custom handler
      } else {
        navigate('/login'); // default redirect
      }
    }
  };

  return (
    <div className="login-page">
      <div className="left-panel">
        <h1>MU Connect</h1>
        <p>Let's get you started!</p>
      </div>

      <div className="right-panel">
        <h2>Sign Up</h2>
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
        <form onSubmit={handleSignUp}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email{userType === 'student' ? ' (@mahindrauniversity.edu.in)' : ''}</label>
          <input
            type="email"
            placeholder={userType === 'student' ? 'Your university email' : 'Your email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        <p className="signup-text">
          Already have an account?{' '}
          <span
            className="signup-link"
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;