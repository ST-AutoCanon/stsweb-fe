


import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false); // Services dropdown state
  const [knowMoreDropdownOpen, setKnowMoreDropdownOpen] = useState(false); // KnowMore dropdown state
  const navigate = useNavigate();

  // Toggles the mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Toggles dropdown for "Services"
  const toggleServicesDropdown = (e) => {
    e.preventDefault();
    setServicesDropdownOpen(!servicesDropdownOpen);
  };

  // Toggles dropdown for "KnowMore"
  const toggleKnowMoreDropdown = (e) => {
    e.preventDefault();
    setKnowMoreDropdownOpen(!knowMoreDropdownOpen);
  };

  // Handles navigation and scrolls the page to the top
  const handleNavClick = (path) => {
    setMenuOpen(false);
    setServicesDropdownOpen(false);
    setKnowMoreDropdownOpen(false);
    setTimeout(() => {
      window.scrollTo(0, 0);
      navigate(path);
    }, 300);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/images/STS-Logo.png" alt="Logo" />
      </div>

      {/* Hamburger icon for mobile */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/" onClick={() => handleNavClick("/")}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/About" onClick={() => handleNavClick("/About")}>
            About
          </NavLink>
        </li>

        {/* Services Dropdown */}
        <li className={`dropdown ${servicesDropdownOpen ? "open" : ""}`}>
          <NavLink
            to="/Services"
            onClick={(e) => handleNavClick("/Services")}
          >
            Services
          </NavLink>
          <span className="dropdown-arrow" onClick={toggleServicesDropdown}><i class='fas fa-chevron-down'></i></span>
          <ul className={`dropdown-menu ${servicesDropdownOpen ? "show" : ""}`}>
            <li>
              <NavLink
                to="/ITNetworkingServices"
                onClick={() => handleNavClick("/ITNetworkFirst")}
              >
                IT Networking Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/EngineeringServices"
                onClick={() => handleNavClick("/EngineeringServiceFirst")}
              >
                Engineering Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/OtherServices"
                onClick={() => handleNavClick("/OtherServiceFirst")}
              >
                Other Services
              </NavLink>
            </li>
          </ul>
        </li>

        {/* KnowMore Dropdown */}
        <li className={`dropdown ${knowMoreDropdownOpen ? "open" : ""}`}>
          <NavLink
            to="/KnowMore"
            onClick={(e) => handleNavClick("/KnowMore")}
          >
            KnowMore
          </NavLink>
          <span className="dropdown-arrow" onClick={toggleKnowMoreDropdown}><i class='fas fa-chevron-down'></i></span>
          <ul className={`dropdown-menu ${knowMoreDropdownOpen ? "show" : ""}`}>
            <li>
              <NavLink
                to="/Broucherfirst"
                onClick={() => handleNavClick("/Broucherfirst")}
              >
                Broucher
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Gallery"
                onClick={() => handleNavClick("/Gallery")}
              >
                Gallery
              </NavLink>
            </li>
          </ul>
        </li>

        <li>
          <NavLink to="/ReachUs" onClick={() => handleNavClick("/ReachusFirst")}>
            ReachUs
          </NavLink>
        </li>
        <div className="loginbtn">
          <li>
            <NavLink to="/Login" onClick={() => handleNavClick("/Login")}>
              EmpLogin
            </NavLink>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
