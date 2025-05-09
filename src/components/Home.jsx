import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { FiHome } from 'react-icons/fi';
import logo from '../assets/logo.jpeg';
// adjust path as needed

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-hero-bg">
      <div className="home-hero-gradient"></div>
      <svg className="home-hero-wave" viewBox="0 0 1440 320"><path fill="#b3e0ff" fillOpacity="0.3" d="M0,224L48,197.3C96,171,192,117,288,117.3C384,117,480,171,576,197.3C672,224,768,224,864,197.3C960,171,1056,117,1152,122.7C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      <div className="home-hero-container">
        <div className="home-hero-content glass-card">
          <h1 className="home-title">Welcome to <span className="brand">MU Connect</span></h1>
          <p className="home-subtitle">The exclusive, modern network for Mahindra University students and alumni.</p>
          <ul className="home-features">
            <li>🤝 Effortless student & alumni connections</li>
            <li>🚀 Curated jobs, internships, and events</li>
            <li>💬 Real-time chat & networking</li>
            <li>🔔 Smart notifications & reminders</li>
            <li>🔖 Save opportunities for later</li>
            <li>🌙 Beautiful dark mode</li>
            <li>🔒 Secure, fast, and easy to use</li>
          </ul>
          <button className="home-cta-btn" onClick={() => navigate('/dashboard')}>Get Started</button>
        </div>
        <div className="home-hero-graphic">
          <div className="home-graphic-circle"></div>
          <img src={logo} alt="MU Connect Logo" className="home-logo-circle animated-float" />
        </div>
      </div>
      <footer className="home-footer">&copy; {new Date().getFullYear()} MU Connect. All rights reserved.</footer>
    </div>
  );
};

export default Home; 