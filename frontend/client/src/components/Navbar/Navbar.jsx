import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Navbar = () => {
  return (
    <nav className="main-navbar">
      <div className="navbar-logo">
        <span className="logo-icon">⭐</span>
        <span className="logo-text">CivicFlow</span>
      </div>
      <div className="navbar-links">
        <a href="#home" className="nav-link active">Report Issue</a>
        <a href="/public" className="nav-link">Track Issues</a>
        <a href="/admin" className="nav-link">Admin Dashboard</a>
        <Link to="/chatbot" className="nav-links">
          <a href="#contact" className="nav-link special-link">Get Help</a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;