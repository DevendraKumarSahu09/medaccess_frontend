import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, userType }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Update the login state
    setIsLoggedIn(false);
    // Navigate to home page
    navigate('/');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <a href="/">MedAccess</a>
        </div>
        <div className="hamburger-menu" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/doctors" className={({ isActive }) => (isActive ? 'active-link' : '')}>Doctors</NavLink>
          </li>
          <li>
            <NavLink to="/hospitals" className={({ isActive }) => (isActive ? 'active-link' : '')}>Hospitals</NavLink>
          </li>
          <li className="dropdown-container" ref={dropdownRef}>
            <div
              className="dropdown-trigger"
              onClick={toggleDropdown}
              onMouseEnter={() => setIsDropdownOpen(true)}
            >
              More <span className="dropdown-arrow">▼</span>
            </div>
            {isDropdownOpen && (
              <ul className="dropdown-menu" onMouseLeave={() => setIsDropdownOpen(false)}>
                <li>
                  <NavLink to="/blood-bank" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    Blood-Bank
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pharmacy" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    Pharmacy
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/hospital-doctors" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    Hospital Doctors
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/beds" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    Beds
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    Contact Us
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {isLoggedIn ? (
          <div className="profile-container" ref={profileDropdownRef}>
            <button
              className="profile-btn"
              onClick={toggleProfileDropdown}
            >
              My Account <span className="dropdown-arrow">▼</span>
            </button>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown">
                <li>
                  <NavLink
                    to={userType === 'doctor' ? '/profile' : '/dashboard'}
                    className={({ isActive }) => (isActive ? 'active-link' : '')}
                  >
                    {userType === 'doctor' ? 'Doctor Profile' : 'Hospital Dashboard'}
                  </NavLink>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link
              to="/login"
              className={`login-btn ${activeButton === 'login' ? 'active' : ''}`}
              onClick={() => handleButtonClick('login')}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`signup-btn ${activeButton === 'signup' ? 'active' : ''}`}
              onClick={() => handleButtonClick('signup')}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
