import React from 'react';
import './About.css'; // Import the custom CSS file for styling

const Page = () => {
  return (
    <section className="about123"> {/* Main section for the About page */}
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
            Engineering & Software Services <span>by SukalpaTech</span>
          </h1>
          
          {/* Paragraph describing the organization */}
          <p>
            The name of our organization was invented with a purpose to keep our vision
            focused: "Let us join to support your deserve." Sukalpa is a Sanskrit word, and
            it stands for Highly Skilled and Knowledge. SukalpaTech abides by its meaning by
            utilizing advanced technologies and well-qualified, experienced staff.
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
