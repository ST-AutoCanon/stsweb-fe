import React, { useState, useEffect } from 'react';
import './Home.css';
import About from "../About/About";
import Services from '../Services/Services';
import HomologationPage from '../Homologation/Homologation';
// Custom Hook to Detect Screen Size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const Home = () => {
  const isMobile = useIsMobile();

  // Different image sets for desktop and mobile
  const desktopImages = [
    './images/Homepage1.png',
    './images/Homepage2.png',
    './images/Homepage4.png',
    './images/home3.png',
  ];

  const mobileImages = [
    './images/m4.png',
    './images/m2.png',
    './images/m5.png',
    './images/m7.png',
  ];

  // Select images based on the screen size
  const images = isMobile ? mobileImages : desktopImages;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [images.length]);

  const handleScrollButtonClick = (index) => {
    setCurrentIndex(index); // Update the active index when a button is clicked
  };

  return (
    <section className="home123">
      <div
        className="hero-image"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Hero Card */}
        <div className="hero-card">
          <h2 className="hero-card-title">Welcome to Sukalpa Tech Solutions</h2>
          <p className="hero-card-description">
            Innovative solutions that drive your business forward.
          </p>
          <button className="learn-moree-btn">Learn More</button>
        </div>
          
        {/* Scrolling Buttons */}
        <div className="scrolling-buttons">
          {images.map((_, index) => (
            <button
              key={index}
              className={`scroll-btn ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleScrollButtonClick(index)}
            ></button>
          ))}
        </div>
      </div>
      
      <Services/>
      <HomologationPage/>
      <About/>
      </section>
  );
};

export default Home;


