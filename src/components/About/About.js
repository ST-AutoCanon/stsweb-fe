import React from 'react';
import './About.css'; // Import the custom CSS file for styling

const Page = () => {
  return (
    <section className="about123"> {/* Main section for the About page */}
    <h2 className="About-header">About Us</h2>
      <div className="page-section"> {/* Container for all content */}
        
        {/* Section for displaying images */}
        <div className="page-images">
          
          {/* First image */}
          <div className="img1">
            <img src="/images/ps1.png" alt="" />
          </div>
          
          {/* Column containing two images */}
          <div className="column">
            <div className="img4">
              <img src="/images/ps4.png" alt="" />
            </div>
            <div className="img2">
              <img src="/images/ps2.png" alt="" />
            </div>
          </div>
          
          {/* Third image */}
          <div className="img3">
            <img src="/images/ps3.png" alt="" />
          </div>
        </div>

        {/* Section for the text content */}
        <div className="page-text">
          
          {/* Main heading for the page */}
          <h1>
          We Are Pioneers In Engineering & Software Services <span></span>
          </h1>
          
          {/* Paragraph describing the organization */}
          <p>
            The name of our organization was invented with a purpose to keep 
            our 
            vision
            focused: "Let us join to support your deserve."  SukalpaTech abides by its meaning by
            utilizing advanced technologies and well-qualified, experienced staff.We Invite you to partner with us on this exciting journey.
          </p>
        
          {/* Link to another page for more information */}
          <a href="/MainAbout" className="learn-more-btn">
            Learn More
          </a>
          
        </div>
      </div>
    </section>
  );
};

export default Page;
