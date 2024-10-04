import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../helper/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import kitabKunjLogo from "./kitabKunj.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    navigate("/",{replace:true})
    auth.signOut();
    localStorage.clear();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav>
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">
            <div className="nav-img"></div>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/all">All Books</Link>
          <Link to="/buy">Buy</Link>
          <Link to="/rent">Rent</Link>
          <Link to="/UploadBookForm">Place your Book</Link>
          {user ? (
            <div
              className="profile"
              onMouseEnter={toggleProfileDropdown}
              onMouseLeave={toggleProfileDropdown}>
              <FontAwesomeIcon icon={faUser} />
              <Link>{user.displayName}</Link>
              {isProfileDropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/ProfileLayout">Profile</Link>
                  <Link to="/dash">Dashboard</Link>
                  <Link onClick={handleLogout}>Logout</Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
