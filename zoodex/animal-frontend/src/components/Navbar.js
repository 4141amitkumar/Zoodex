import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>ZooDex</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/scan">Scan Animal</Link>
        <Link to="/detect">Detect Animal</Link>
      </div>
    </nav>
  );
};

export default Navbar;
