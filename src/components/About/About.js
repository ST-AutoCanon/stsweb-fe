import React from 'react';
import './About.css'; // Create this CSS file for custom styles

const Page = () => {
  return (
    <section className="about123">
    <div className="page-section">
      <div className="page-images">
        <div class="img1">
        <img src= "/images/ps1.png" alt=""/>
          </div>
          <div class="coulmn">
        <div class="img4">
        <img src= "/images/ps4.png" alt=""/>
       
        </div>
        <div class="img2">
        <img src= "/images/ps2.png" alt=""/>
       
        </div>
        </div>
        <div class="img3">
        <img src= "/images/ps3.png" alt=""/>
        
        </div>
        
        </div>
    
      <div className="page-text">
        <h1>






          Engineering & Software Services <span>by SukalpaTech</span>
        </h1>
        <p>



          The name of our organization was invented with a purpose to keep our vision 
          focused: "Let us join to support your deserve." Sukalpa is a Sanskrit word, and 
          it stands for Highly Skilled and Knowledge. SukalpaTech abides by its meaning by 
          utilizing advanced technologies and well-qualified, experienced staff.





        </p>
      </div>
      <div className="learn-morebtn">
    <button className="learn-more-btn">Learn More</button>
    </div>
    </div>
   
    </section>
  );
};

export default Page;
