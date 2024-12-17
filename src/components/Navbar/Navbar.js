

// import React, { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import './Navbar.css';

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
//   const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
//   const navigate = useNavigate();

//   // Toggles the menu (used for mobile responsiveness)
//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   // Toggles dropdown visibility
//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };
  
  
//   // Assuming this is your existing function for handling navigation
// const handleNavClick = (path) => {
//   // Close the menu immediately
//   setMenuOpen(false);

//   // Add a slight delay to ensure the menu closes smoothly
//   setTimeout(() => {
//     // Your existing navigation logic
//     window.scrollTo(0, 0); // Scroll to the top of the page
//     navigate(path); // Navigate to the specified path
//   }, 1000); // Adjust delay (in milliseconds) based on your desired transition speed
// };

//   return (
//     <nav className="navbar">
//       <div className="logo">
//         <img src="/images/image 108.png" alt="Logo" />
//       </div>

//       {/* Hamburger icon for mobile menu */}
//       <div className="hamburger" onClick={toggleMenu}>
//         <span className="line"></span>
//         <span className="line"></span>
//         <span className="line"></span>
//       </div>

//       {/* Navigation links */}
//       <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
//         <li>
//           <NavLink to="/" onClick={() => handleNavClick('/')}>
//             Home
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/About" onClick={() => handleNavClick('/About')}>
//             About
//           </NavLink>
//         </li>

//         {/* Dropdown for Services */}
//         <li className="dropdown" onClick={toggleDropdown}>
//           <NavLink to="/Services" onClick={() => handleNavClick('/Services')}>
//             Services
//           </NavLink>
//           {/* Dropdown Menu */}
//           <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
//             <li><NavLink to="/ITNetworkingServices">ITNetworkingServices</NavLink></li>
//             <li><NavLink to="/EngineeringServices">EngineeringServices</NavLink></li>
//             <li><NavLink to="/OtherServices">OtherServices</NavLink></li>
            
//           </ul>
//         </li>

//         <li>
//           <NavLink
//             to="/Homologation"
//             onClick={() => handleNavClick('/Homologation')}
//           >
//             Testimonials
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/ReachUs" onClick={() => handleNavClick('/ReachUs')}>
//             Reach Us
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/KnowMore" onClick={() => handleNavClick('/KnowMore')}>
//             Know More
//           </NavLink>
//         </li>
//         <div className="loginbtn">
//           <li>
//             <NavLink to="/Login" onClick={() => handleNavClick('/Login')}>
//               Emp-Login
//             </NavLink>
//           </li>
//         </div>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Tooling from '../Tooling/Tooling';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const navigate = useNavigate();

  // Toggles the menu (used for mobile responsiveness)
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Toggles dropdown visibility
  const toggleDropdown = (e) => {
    e.preventDefault(); // Prevent default navigation
    setDropdownOpen(!dropdownOpen); // Toggle the dropdown menu
  };

  // Handles navigation and scrolls the page to the top
  const handleNavClick = (path) => {
    // Close the menu
    setMenuOpen(false);

    // Add a slight delay to ensure the menu closes smoothly
    setTimeout(() => {
      window.scrollTo(0, 0); // Scroll to the top of the page
      navigate(path); // Navigate to the specified path
    }, 300); // Adjust delay as needed
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/images/image 108.png" alt="Logo" />
      </div>

      {/* Hamburger icon for mobile menu */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>

      {/* Navigation links */}
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <NavLink to="/" onClick={() => handleNavClick('/')}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/About" onClick={() => handleNavClick('/About')}>
            About
          </NavLink>
        </li>

        {/* Dropdown for Services */}
        <li className="dropdown">
          <NavLink
            to="/Services"
            onClick={(e) => {
              toggleDropdown(e); // Open dropdown menu
              handleNavClick('/Services'); // Navigate to the "Services" page
            }}
          >
            Services
          </NavLink>
          {/* Dropdown Menu */}
          <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
            <li>
              <NavLink
                to="/ITNetworkingServices"
                onClick={() => handleNavClick('/ITNetworkingServices')}
              >
                ITNetworkingServices
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/EngineeringServices"
                onClick={() => handleNavClick('/EngineeringServices')}
              >
                EngineeringServices
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/OtherServices"
                onClick={() => handleNavClick('/OtherServices')}
              >
                OtherServices
              </NavLink>
            </li>
          </ul>
        </li>

        <li>
          <NavLink
            to="/Homologation"
            onClick={() => handleNavClick('/Homologation')}
          >
            Testimonials
          </NavLink>
        </li>
        <li>
          <NavLink to="/ReachUs" onClick={() => handleNavClick('/ReachUs')}>
            Reach Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/KnowMore" onClick={() => handleNavClick('/KnowMore')}>
            Know More
          </NavLink>
        </li>
        <div className="loginbtn">
          <li>
            <NavLink to="/Login" onClick={() => handleNavClick('/Login')}>
              Emp-Login
            </NavLink>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
