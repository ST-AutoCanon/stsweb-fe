// import React from 'react';
// import './HomologationFirst.css';

// const HomologationFirst = () => {
//   return (
//     <div className="homologation-container">
//       <div className="homologation-title">
//         <h1>Homologation?</h1>
//       </div>

//       <div className="homologation-content">
//         {/* Circle Diagram Section */}
//         <div className="homologation-circle">
//           <img src="/images/homologation_desktop.png" alt="Homologation Circle Diagram" />
//         </div>

//         {/* Process Flow Section */}
//         <div className="homologation-steps">
//           <svg
//             className="curved-line"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 150 1390 400" 
//             preserveAspectRatio="none"
//           >
//             <path
//               d="M5,500 C800,700 600,200 1200,400 C1600,600 1400,150 1390,200"
//               stroke="white"
//               strokeWidth="3"
//               strokeDasharray="8,8"
//               fill="none"
//             />
//           </svg>

//           {/* Location Icons */}
//           <div className="location-icons">
//             <div className="location-icon location-step-1">
//               <div className="icon-stick"></div>
//             </div>
//             <div className="location-icon location-step-2">
//               <div className="icon-stick"></div>
//             </div>
//             <div className="location-icon location-step-3">
//               <div className="icon-stick"></div>
//             </div>
//             <div className="location-icon location-step-4">
//               <div className="icon-stick"></div>
//             </div>
//             <div className="location-icon location-step-5">
//               <div className="icon-stick"></div>
//             </div>
//           </div>

//           {/* Steps */}
//           <div className="step what-is-homologation">
//             <h2>What is Homologation?</h2>
//             <p>
//               Homologation is the process of getting Government Approval by means of a Certificate which allows the product to enter the targeted market. The process starts with the initial assessment, followed by the list of tests according to standards and directives until the compilation of validated technical reports that result in approval.
//             </p>
//           </div>

//           <div className="step pre-homologation-process">
//             <h2>Pre-Homologation Process</h2>
//             <p>
//               Pre-Homologation involves the performance of all or critical tests as per the applicable regulations, similar to actual tests that are performed by the testing agency during the approval process.
//             </p>
//           </div>

//           <div className="step documentation">
//             <h2>Documentation</h2>
//             <p>
//               Homologation involves the process of gathering Government approvals for a series of certificates and allows the product to enter the targeted market.
//             </p>
//           </div>

//           <div className="step testing-validation">
//             <h2>Testing and Validation</h2>
//             <p>
//               Testing ensures that the product meets all regulatory requirements. The process involves rigorous assessments.
//             </p>
//           </div>

//           <div className="step certification">
//             <h2>Certification</h2>
//             <p>
//               Certification is the final step where the product is officially approved and certified to enter the market.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomologationFirst;import React from 'react';
import React from 'react';
import './HomologationFirst.css';

const HomologationFirst = () => {
  return (
    <div className="homologation-container">
      <div className="homologation-title">
        <h1>Homologation?</h1>
      </div>

      <div className="homologation-content">
        {/* Circle Diagram Section */}
        <div className="homologation-circle">
          <img src="/images/homologation_desktop.png" alt="Homologation Circle Diagram" />
        </div>

        {/* Process Flow Section */}
        <div className="homologation-steps">
          <svg
            className="curved-line"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 150 1390 400"
            preserveAspectRatio="none"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="-72"
                refY="29"
                orient="auto"
              >
                <polygon points="1 2, 6 8, 10 0" fill="white" />
              </marker>
            </defs>

            <path
              d="M5,500 C800,700 600,200 1200,400 C1500,600 1400,150 1390,180"
              stroke="white"
              strokeWidth="3"
              strokeDasharray="8,8"
              fill="none"
              marker-end="url(#arrowhead)"
            />
          </svg>

          {/* Location Icons */}
          <div className="location-icons">
            <div className="location-icon location-step-1">
              <div className="icon-stick"></div>
            </div>
            <div className="location-icon location-step-2">
              <div className="icon-stick"></div>
            </div>
            <div className="location-icon location-step-3">
              <div className="icon-stick"></div>
            </div>
            <div className="location-icon location-step-4">
              <div className="icon-stick"></div>
            </div>
            <div className="location-icon location-step-5">
              <div className="icon-stick"></div>
            </div>
          </div>

          {/* Steps */}
          <div className="step what-is-homologation">
            <div className="step-title1">
              <img src="/images/what_homo.png" alt="Step 1 Icon" />
              <h2>What is Homologation?</h2>
            </div>
           <p>Homologation is the process of obtaining government approval for a product to enter a market. It involves assessment, testing based on standards, and validation of technical reports for approval.</p>
            <img src="/images/flow.png" className="step-image" alt="What is Homologation?" />
          </div>

          <div className="step pre-homologation-process">
            <div className="step-title2">
              <img src="/images/pre_homo.png" alt="Step 2 Icon" />
              <h2>Pre-Homologation Process</h2>
            </div>
            <p>
              Pre-homologation involves initial tests like performance checks and compliance verification to address potential issues before formal certification.
            </p>
            <img src="/images/flow.png" className="step-image" alt="What is Homologation?" />
          </div>

          <div className="step documentation">
            <div className="step-title3">
              <img src="/images/Subtract.png" alt="Step 3 Icon" />
              <h2>Documentation</h2>
            </div>
            <p>
              Detailed records, including technical data and compliance reports, are prepared to support the certification process.
            </p>
            <img src="/images/flow.png" className="step-image" alt="What is Homologation?" />
          </div>

          <div className="step testing-validation">
            <div className="step-title4">
              <img src="/images/testing n validationnew.png" alt="Step 4 Icon" />
              <h2>Testing and Validation</h2>
            </div>
            <p>
              Comprehensive testing ensures safety and reliability. Validation confirms that the product meets design and regulatory requirements.
            </p>
            <img src="/images/flow.png" className="step-image" alt="What is Homologation?" />
          </div>

          <div className="step certification">
            <div className="step-title">
              <img src="/images/certifi.png" alt="Step 5 Icon" />
              <h2>Certification</h2>
            </div>
            <p>
              Certification is the final step, where an official approval is granted, confirming compliance with all applicable standards and regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomologationFirst;
