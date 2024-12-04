import React,{ useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    
    <nav className="navbar">
        <div className="logo">
         <img src="/images/image 108.png" alt="Logo" />
       </div>
       
      <div className="hamburger" onClick={toggleMenu}>
        {/* Hamburger icon */}
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>
     
     
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <NavLink to="/" exact activeClassName="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/About" activeClassName="active">
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/Services" activeClassName="active">
            Services
          </NavLink>
        </li>
       
        <li>
          <NavLink to="/Homologation" activeClassName="active">
            Testimonials
          </NavLink>
        </li>
        <li>
          <NavLink to="/ReachUs" activeClassName="active">
          ReachUs
          </NavLink>
        </li>
        <li>
          <NavLink to="/KnowMore" activeClassName="active">
          KnowMore
          </NavLink>
        </li>
        <li>
          <NavLink to="/Login" activeClassName="active">
         Login
          </NavLink>
        </li>
      </ul>
      <div class="right-section">
    <div class="search-icon">
      <i class="fas fa-search"></i> 
    </div>
    </div>
     
      {/* <div className="profile">
        <i className="fas fa-user-circle"></i>
        <span>John Doe</span>
      </div> */}
      
    </nav>
  );
};

export default Navbar;

