
// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import "./Navbar.css";
// import Login from "../Login/Login.js"; // Import the Login component instead of Modal

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
//   const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false); // Services dropdown state
//   const [knowMoreDropdownOpen, setKnowMoreDropdownOpen] = useState(false); // KnowMore dropdown state
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for showing the popup
//   const navigate = useNavigate();

//   // Toggles the mobile menu
//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   // Toggles dropdown for "Services"
//   const toggleServicesDropdown = (e) => {
//     e.preventDefault();
//     setServicesDropdownOpen(!servicesDropdownOpen);
//   };

//   // Toggles dropdown for "KnowMore"
//   const toggleKnowMoreDropdown = (e) => {
//     e.preventDefault();
//     setKnowMoreDropdownOpen(!knowMoreDropdownOpen);
//   };

//   // Handles navigation and scrolls the page to the top
//   const handleNavClick = (path, closeDropdown = true) => {
//     if (closeDropdown) {
//       setMenuOpen(false);
//       setServicesDropdownOpen(false);
//       setKnowMoreDropdownOpen(false);
//     }
//     setTimeout(() => {
//       window.scrollTo(0, 0);
//       navigate(path);
//     }, 300);
//   };
  
 
//   // Open Login modal (triggering the Login form)
//   const openModal = () => {
//     setIsModalOpen(true);  // Trigger modal open by updating state to true
//   };

//   // Open Login modal (triggering the Login form)
//   const CloseModal = () => {
//     setIsModalOpen(false);  // Trigger modal open by updating state to true
//   };
//   return (
//     <>
//       <nav className="navbar">
//         <div className="logo">
//           <img src="/images/STS-Logo.png" alt="Logo" />
//         </div>

//         {/* Hamburger icon for mobile */}
//         <div className="hamburger" onClick={toggleMenu}>
//           <span className="line"></span>
//           <span className="line"></span>
//           <span className="line"></span>
//         </div>

//         {/* Navigation Links */}
//         <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
//           <li>
//             <NavLink to="/" onClick={() => handleNavClick("/")}>
//               Home
//             </NavLink>
//           </li>
//           <li>
//             <NavLink to="/About" onClick={() => handleNavClick("/mainabout")}>
//               About
//             </NavLink>
//           </li>

//           {/* Services Dropdown */}
//           <li className={`dropdown ${servicesDropdownOpen ? "open" : ""}`}>
//             <NavLink
//               to="/Services"
//               onClick={(e) => handleNavClick("/Services")}
//             >
//               Services
//             </NavLink>
//             <span className="dropdown-arrow" onClick={toggleServicesDropdown}>
//               <i className="fas fa-chevron-down"></i>
//             </span>
//             <ul className={`dropdown-menu ${servicesDropdownOpen ? "show" : ""}`}>
//               <li>
//                 <NavLink
//                   to="/ITNetworkingServices"
//                   onClick={() => handleNavClick("/ITNetworkFirst")}
//                 >
//                   IT Networking Services
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/EngineeringServices"
//                   onClick={() => handleNavClick("/EngineeringServiceFirst")}
//                 >
//                   Engineering Services
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/OtherServices"
//                   onClick={() => handleNavClick("/OtherServiceFirst")}
//                 >
//                   Other Services
//                 </NavLink>
//               </li>
//             </ul>
//           </li>

//           {/* KnowMore Dropdown */}
//           <li className={`dropdown ${knowMoreDropdownOpen ? "open" : ""}`}>
//             <NavLink
//               to="/KnowMore"
//               onClick={(e) => handleNavClick("/KnowMore")}
//             >
//               Know More
//             </NavLink>
//             <span className="dropdown-arrow" onClick={toggleKnowMoreDropdown}>
//               <i className="fas fa-chevron-down"></i>
//             </span>
//             <ul className={`dropdown-menu ${knowMoreDropdownOpen ? "show" : ""}`}>
//               <li>
//                 <NavLink
//                   to="/KnowMoreFirstPage"
//                   onClick={() => handleNavClick("/KnowMoreFirstPage")}
//                 >
//                   Broucher
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/Gallery"
//                   onClick={() => handleNavClick("/Gallery")}
//                 >
//                   Gallery
//                 </NavLink>
//               </li>
//             </ul>
//           </li>

//           <li>
//             <NavLink to="/Reachusfirst" onClick={() => handleNavClick("/Reachusfirst")}>
//               ReachUs
//             </NavLink>
//           </li>

//           <li>         
//               <a
//              href="https://auto-canon.in/" // Replace with your desired product URL
//              target="_blank"             rel="noopener noreferrer"
//             className="product-link"
//            >
//              Product
//            </a>
//          </li>
          
//           <div className="loginbtn">
//             <li>
//               <button onClick={openModal}>Emp-Login</button> {/* Trigger login form/modal on button click */}
//             </li>
//           </div>
//         </ul>
//       </nav>

//       {/* Show Login component in a modal-like fashion */}
//       {isModalOpen && <Login onClose={CloseModal} />} {/* Render the Login modal when isModalOpen is true */}
//     </>
//   );
// };

// export default Navbar;




import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Login from "../Login/Login.js"; // Import the Login component instead of Modal
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false); // Services dropdown state
  const [knowMoreDropdownOpen, setKnowMoreDropdownOpen] = useState(false); // KnowMore dropdown state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for showing the popup
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

  // Open Login modal (triggering the Login form)
  const openModal = () => {
    setIsModalOpen(true); // Trigger modal open by updating state to true
    setMenuOpen(false);   // Close the mobile menu
  };

  // Close the Login modal
  const CloseModal = () => {
    setIsModalOpen(false); // Trigger modal close by updating state to false
  };

  return (
    <>
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
            <NavLink to="/About" onClick={() => handleNavClick("/mainabout")}>
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
            <span className="dropdown-arrow" onClick={toggleServicesDropdown}>
              <i className="fas fa-chevron-down"></i>
            </span>
            <ul className={`dropdown-menu ${servicesDropdownOpen ? "show" : ""}`}>
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

          {/* KnowMore Dropdown */}
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
            <ul className={`dropdown-menu ${knowMoreDropdownOpen ? "show" : ""}`}>
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
            <NavLink to="/Reachusfirst" onClick={() => handleNavClick("/Reachusfirst")}>
              ReachUs
            </NavLink>
          </li>

          <li>
            <a
              href="https://auto-canon.in/" // Replace with your desired product URL
              target="_blank"
              rel="noopener noreferrer"
              className="product-link"
            >
              Product
            </a>
          </li>

          <div className="loginbtn">
            <li>
              <button onClick={openModal}>Emp-Login</button> {/* Trigger login form/modal on button click */}
            </li>
          </div>
        </ul>
      </nav>

      {/* Show Login component in a modal-like fashion */}
      {isModalOpen && <Login onClose={CloseModal} />} {/* Render the Login modal when isModalOpen is true */}
    </>
  );
};
export default Navbar;