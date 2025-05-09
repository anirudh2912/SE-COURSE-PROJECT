// src/components/Header.js
import React from 'react';
import './Header.css';
import logo from 'src/assets/logo.jpeg'; 
function Header() {
  return (
    <header className="header">
      <div className="logo">MU Connect</div>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#profile">Profile</a></li>
          <li><a href="#login">Login</a></li>
          <li><a href="#signup">Sign Up</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
