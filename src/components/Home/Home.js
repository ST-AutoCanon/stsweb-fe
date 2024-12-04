
import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const images = [
    './images/a1.png',
    './images/a2.png',
    './images/a5.jpeg',
    './images/a6.jpeg',
  ];

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
        <h2 className="hero-card-title">Welcome to Sukalpa Tech solutions</h2>
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
    </section>
  );
};

export default Home;
