import React from "react";
import "./About.css";

const Page = () => {
  return (
    <section className="about123">
      <h2 className="About-header">About Us</h2>
      <div className="page-section">
        <div className="page-images">
          <div className="img1">
            <img src="/images/ps1.png" alt="" />
          </div>

          <div className="column">
            <div className="img4">
              <img src="/images/ps4.png" alt="" />
            </div>
            <div className="img2">
              <img src="/images/ps2.png" alt="" />
            </div>
          </div>

          <div className="img3">
            <img src="/images/ps3.png" alt="" />
          </div>
        </div>

        <div className="page-text">
          <h1>
            We Are Pioneers In Engineering & Software Services <span></span>
          </h1>

          <p>
            The name of our organization was invented with a purpose to keep our
            vision focused: "Let us join to support your deserve." SukalpaTech
            abides by its meaning by utilizing advanced technologies and
            well-qualified, experienced staff.We Invite you to partner with us
            on this exciting journey.
          </p>

          <a href="/MainAbout" className="learn-more-btn">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Page;
