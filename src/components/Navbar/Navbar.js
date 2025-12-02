import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import "./Navbar.css";
import Login from "../Login/Login.js";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [knowMoreDropdownOpen, setKnowMoreDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const hiddenPages = ["/dashboard", "/other"];

  const location = useLocation();
  const isHidden = hiddenPages.includes(location.pathname);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleServicesDropdown = (e) => {
    e.preventDefault();
    setServicesDropdownOpen(!servicesDropdownOpen);
  };

  const toggleKnowMoreDropdown = (e) => {
    e.preventDefault();
    setKnowMoreDropdownOpen(!knowMoreDropdownOpen);
  };

  const handleNavClick = (path, closeDropdown = true) => {
    if (closeDropdown) {
      setMenuOpen(false);
      setServicesDropdownOpen(false);
      setKnowMoreDropdownOpen(false);
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
      navigate(path);
    }, 300);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setMenuOpen(false);
  };

  const CloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${isHidden ? "hide-navbar-mobile" : ""}`}>
        <nav className="navbar">
          <div className="logo">
            <img src="/images/STS-Logo.png" alt="Logo" />
          </div>

          <div className="hamburger" onClick={toggleMenu}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li>
              <NavLink to="/" onClick={() => handleNavClick("/")}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/About" onClick={() => handleNavClick("/mainabout")}>
                About
              </NavLink>
            </li>

            <li className={`dropdown ${servicesDropdownOpen ? "open" : ""}`}>
              <NavLink
                to="/Services"
                onClick={(e) => handleNavClick("/Services")}
              >
                Services
              </NavLink>
              <span className="dropdown-arrow" onClick={toggleServicesDropdown}>
                <i className="fas fa-chevron-down"></i>
              </span>
              <ul
                className={`dropdown-menu ${
                  servicesDropdownOpen ? "show" : ""
                }`}
              >
                <li>
                  <NavLink
                    to="/ITNetworkingServices"
                    onClick={() => handleNavClick("/ITNetworkFirst")}
                  >
                    IT Services
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

            <li className={`dropdown ${knowMoreDropdownOpen ? "open" : ""}`}>
              <NavLink
                to="/KnowMoreFirtstPage"
                onClick={(e) => handleNavClick("/KnowMore")}
              >
                Know More
              </NavLink>
              <span className="dropdown-arrow" onClick={toggleKnowMoreDropdown}>
                <i className="fas fa-chevron-down"></i>
              </span>
              <ul
                className={`dropdown-menu ${
                  knowMoreDropdownOpen ? "show" : ""
                }`}
              >
                <li>
                  <NavLink
                    to="/Broucher"
                    onClick={() => handleNavClick("/Broucher")}
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
              <NavLink
                to="/Reachusfirst"
                onClick={() => handleNavClick("/Reachusfirst")}
              >
                ReachUs
              </NavLink>
            </li>

            <li>
              <a
                href="https://auto-canon.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="product-link"
              >
                Product
              </a>
            </li>

            <div className="loginbtn">
              <li>
                <button onClick={openModal}>Emp-Login</button>
              </li>
            </div>
          </ul>
        </nav>

        {isModalOpen && <Login onClose={CloseModal} />}
      </nav>
    </>
  );
};
export default Navbar;
