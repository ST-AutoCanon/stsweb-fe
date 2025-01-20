// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import Typewriter from 'typewriter-effect'; // Install via `npm install typewriter-effect`
// // import About from "../About/About";
// // import Services from '../Services/Services';
// // import HomologationFirst from '../HomologationFirst/HomologationFirst';
// // import './Home.css';

// // const Home = () => {
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [isTyping, setIsTyping] = useState(false);
// //   const [paused, setPaused] = useState(false); // State to handle pause after typing
// //   const [timeoutId, setTimeoutId] = useState(null); // Store the timeout ID for the slide transition
// //   const navigate = useNavigate();

// //   // Define images and content for all carousel items
// //   const desktopImages = [
// //     './images/Homepage1.png',
// //     './images/Homepage2.png',
// //     './images/Homepage4.png',
// //     './images/HomeP3.png',
// //   ];

// //   const typewriterContents = [
// //     { text: 'At STS, we specialize in providing seamless turnkey solutions that handle every aspect of your project. From initial concept to final execution, we take care of all the details so you can focus on what matters most-growing your business.  ', duration: 20000 },
// //     { text: 'We specialize in delivering end-to-end 3-wheeler design solutions, offering custom branding, high- quality vehicle wraps, and expert installation to enhance visibility and drive your brand forward on the road..', duration: 15000 },
// //     { text: 'Let us help you innovate and grow with cutting-edge technologies.', duration: 10000 },
// //     { text: 'Join us and experience a brighter future with our tech expertise Join us and experience a brighter future with our tech expertise.', duration: 6000 },
// //   ];

// //   const isMobile = window.innerWidth <= 768;
// //   const images = desktopImages;

// //   // Slide transition logic with pause
// //   useEffect(() => {
// //     if (paused || isTyping) return; // Don't transition while paused or typing

// //     const timeout = setTimeout(() => {
// //       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
// //     }, typewriterContents[currentIndex].duration); // Duration for each slide

// //     setTimeoutId(timeout);

// //     return () => clearTimeout(timeout); // Cleanup the timeout when component unmounts or dependencies change
// //   }, [currentIndex, isTyping, paused]);

// //   // Handle scroll button click to change slides
// //   const handleScrollButtonClick = (index) => {
// //     setCurrentIndex(index);
// //     setPaused(false); // Reset pause when manually clicking to change slide
// //   };

// //   const handleLearnMoreClick = () => {
// //     navigate("/MainAbout");
// //   };

// //   return (
// //     <section className="home123">
// //       <div
// //         className="hero-image"
// //         style={{
// //           backgroundImage: `url(${images[currentIndex]})`,
// //           backgroundSize: 'cover',
// //           backgroundPosition: 'center',
// //           backgroundRepeat: 'no-repeat',
// //         }}
// //       >
// //         {/* Hero Card */}
// //         <div className="hero-card">
// //           <h1 className="hero-card-title1">welcome to</h1>
// //           <h2 className="hero-card-title">Sukalpa Tech Solutions</h2>
// //           {/* <p className="hero-card-description">Let us join to support you deserve</p> */}
// //           {/* <button className="learn-moree-btn" onClick={handleLearnMoreClick}>
// //             Learn More
// //           </button> */}
// //         </div>

// //         {/* Dynamic Content Box */}
// //         <div className="dynamic-box">
// //   <div className="box-content">
// //     <Typewriter
// //       options={{
// //         strings: [typewriterContents[currentIndex].text],
// //         autoStart: true,
// //         loop: false, // Ensures content does not repeat
// //         delay: 70,
// //         deleteSpeed: 0, // Prevents content from deleting
// //         onStart: () => setIsTyping(true),
// //         onComplete: () => {
// //           // setIsTyping(false);
// //           // Pause after typing is complete, and delay for 5 seconds
// //           setPaused(true);
// //           setTimeout(() => {
// //             setPaused(false);
// //             setIsTyping(false);
// //             setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);

// //           }, 10000); // 5000ms = 5 seconds
// //         },
// //       }}
// //     />
// //   </div>
// // </div>


// //         {/* Scrolling Buttons */}
// //         <div className="scrolling-buttons">
// //           {images.map((_, index) => (
// //             <button
// //               key={index}
// //               className={`scroll-btn ${index === currentIndex ? 'active' : ''}`}
// //               onClick={() => handleScrollButtonClick(index)}
// //             ></button>
// //           ))}
// //         </div>
// //       </div>

// //       <div className='HomeServices'>
// //         <Services />
// //       </div>
// //       <div className='HomeServices1'>
// //         <HomologationFirst />
// //       </div>
// //       <div className='HomeServices3'>
// //         <About />
// //       </div>
// //     </section>
// //   );
// // };

// // export default Home;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Typewriter from 'typewriter-effect'; // Install via `npm install typewriter-effect`
// import About from "../About/About";
// import Services from '../Services/Services';
// import HomologationFirst from '../HomologationFirst/HomologationFirst';
// import './Home.css';

// const Home = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const [paused, setPaused] = useState(false); // State to handle pause after typing
//   const [timeoutId, setTimeoutId] = useState(null); // Store the timeout ID for the slide transition
//   const navigate = useNavigate();

//   // Define images and content for all carousel items
//   const desktopImages = [
//     './images/Homepage1.png',
//     './images/Homepage2.png',
//     './images/Homepage4.png',
//     './images/HomeP3.png',
//   ];

//   const typewriterContents = [
//     { text: 'At STS, we specialize in providing seamless turnkey solutions that handle every aspect of your project. From initial concept to final execution, we take care of all the details so you can focus on what matters most-growing your business.  ', duration: 20000 },
//     { text: 'We specialize in delivering end-to-end 3-wheeler design solutions, offering custom branding, high-quality vehicle wraps, and expert installation to enhance visibility and drive your brand forward on the road..', duration: 15000 },
//     { text: 'Let us help you innovate and grow with cutting-edge technologies.', duration: 10000 },
//     { text: 'Join us and experience a brighter future with our tech expertise.', duration: 6000 },
//   ];

//   // Define different background colors and text colors for each dynamic box
//   const boxStyles = [
//     { backgroundColor: '#ffcccb', textColor: '#b30000' }, // Light red background with dark red text
//     { backgroundColor: '#ccffcc', textColor: '#006600' }, // Light green background with dark green text
//     { backgroundColor: '#cceeff', textColor: '#003366' }, // Light blue background with dark blue text
//     { backgroundColor: '#ffffcc', textColor: '#999900' }, // Light yellow background with dark yellow text
//   ];

//   const isMobile = window.innerWidth <= 768;
//   const images = desktopImages;

//   // Slide transition logic with pause
//   useEffect(() => {
//     if (paused || isTyping) return; // Don't transition while paused or typing

//     const timeout = setTimeout(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, typewriterContents[currentIndex].duration); // Duration for each slide

//     setTimeoutId(timeout);

//     return () => clearTimeout(timeout); // Cleanup the timeout when component unmounts or dependencies change
//   }, [currentIndex, isTyping, paused]);

//   // Handle scroll button click to change slides
//   const handleScrollButtonClick = (index) => {
//     setCurrentIndex(index);
//     setPaused(false); // Reset pause when manually clicking to change slide
//   };

//   const handleLearnMoreClick = () => {
//     navigate("/MainAbout");
//   };

//   return (
//     <section className="home123">
//       <div
//         className="hero-image"
//         style={{
//           backgroundImage: `url(${images[currentIndex]})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//         }}
//       >
//         {/* Hero Card */}
//         <div className="hero-card">
//           <h1 className="hero-card-title1">Welcome to</h1>
//           <h2 className="hero-card-title">Sukalpa Tech Solutions</h2>
//         </div>

//         {/* Dynamic Content Box */}
//         <div
//           className="dynamic-box"
//           style={{
//             backgroundColor: boxStyles[currentIndex].backgroundColor,
//             color: boxStyles[currentIndex].textColor, // Set text color dynamically
//           }}
//         >
//           <div className="box-content">
//             <Typewriter
//               options={{
//                 strings: [typewriterContents[currentIndex].text],
//                 autoStart: true,
//                 loop: false, // Ensures content does not repeat
//                 delay: 70,
//                 deleteSpeed: 0, // Prevents content from deleting
//                 onStart: () => setIsTyping(true),
//                 onComplete: () => {
//                   // setIsTyping(false);
//                   // Pause after typing is complete, and delay for 5 seconds
//                   setPaused(true);
//                   setTimeout(() => {
//                     setPaused(false);
//                     setIsTyping(false);
//                     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//                   }, 10000); // 10000ms = 10 seconds
//                 },
//               }}
//             />
//           </div>
//         </div>

//         {/* Scrolling Buttons */}
//         <div className="scrolling-buttons">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               className={`scroll-btn ${index === currentIndex ? 'active' : ''}`}
//               onClick={() => handleScrollButtonClick(index)}
//             ></button>
//           ))}
//         </div>
//       </div>

//       <div className='HomeServices'>
//         <Services />
//       </div>
//       <div className='HomeServices1'>
//         <HomologationFirst />
//       </div>
//       <div className='HomeServices3'>
//         <About />
//       </div>
//     </section>
//   );
// };

// export default Home;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Typewriter from 'typewriter-effect'; // Install via `npm install typewriter-effect`
// import About from "../About/About";
// import Services from '../Services/Services';
// import HomologationFirst from '../HomologationFirst/HomologationFirst';
// import './Home.css';

// const Home = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const [paused, setPaused] = useState(false); // State to handle pause after typing
//   const [timeoutId, setTimeoutId] = useState(null); // Store the timeout ID for the slide transition
//   const navigate = useNavigate();

//   // Define images and content for all carousel items
//   const desktopImages = [
//     './images/homenew101.png',
//     './images/homenew102.png',
//     './images/homenew103.png',
//     './images/truck1.png',
//   ];

//   const typewriterContents = [
//     { text: 'At STS, we specialize in providing seamless turnkey solutions that handle every aspect of your project. From initial concept to final execution, we take care of all the details so you can focus on what matters most-growing your business.  ', duration: 20000 },
//     { text: 'We specialize in delivering end-to-end 3-wheeler design solutions, offering custom branding, high-quality vehicle wraps, and expert installation to enhance visibility and drive your brand forward on the road..', duration: 15000 },
//     { text: 'Let us help you innovate and grow with cutting-edge technologies.', duration: 10000 },
//     { text: 'Join us and experience a brighter future with our tech expertise.', duration: 6000 },
//   ];

//   // Define different background colors and text colors for each dynamic box
//   const boxStyles = [
//     { backgroundColor: '#ffcccb', textColor: '#b30000' }, // Light red background with dark red text
//     { backgroundColor: '#ccffcc', textColor: '#006600' }, // Light green background with dark green text
//     { backgroundColor: '#cceeff', textColor: '#003366' }, // Light blue background with dark blue text
//     { backgroundColor: '#ffffcc', textColor: '#999900' }, // Light yellow background with dark yellow text
//   ];

//   const isMobile = window.innerWidth <= 768;
//   const images = desktopImages;

//   // Slide transition logic with pause
//   useEffect(() => {
//     if (paused || isTyping) return; // Don't transition while paused or typing

//     const timeout = setTimeout(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, typewriterContents[currentIndex].duration); // Duration for each slide

//     setTimeoutId(timeout);

//     return () => clearTimeout(timeout); // Cleanup the timeout when component unmounts or dependencies change
//   }, [currentIndex, isTyping, paused]);

//   // Handle scroll button click to change slides
//   const handleScrollButtonClick = (index) => {
//     setCurrentIndex(index);
//     setPaused(false); // Reset pause when manually clicking to change slide
//   };

//   const handleLearnMoreClick = () => {
//     navigate("/MainAbout");
//   };

//   // Custom function to stop the typewriter effect at any desired point
//   const stopTypewriting = (typewriter) => {
//     // Stop the typing immediately
//     typewriter.stop();
//     setIsTyping(false);
//     setPaused(true); // Optionally, pause after stopping
//   };

//   return (
//     <section className="home123">
//       <div
//         className="hero-image"
//         style={{
//           backgroundImage: `url(${images[currentIndex]})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//         }}
//       >
//         {/* Hero Card */}
//         <div className="hero-card">
//           <h1 className="hero-card-title1">Welcome to</h1>
//           <h2 className="hero-card-title">Sukalpa Tech Solutions</h2>
//           <p className="hero-card-description">Let us join to support you deserve</p> 
//          <button className="learn-moree-btn" onClick={handleLearnMoreClick}>
//              Learn More           </button> 
//         </div>

//         {/* Dynamic Content Box */}
//         <div
//           className="dynamic-box"
//           style={{
//             backgroundColor: boxStyles[currentIndex].backgroundColor,
//             color: boxStyles[currentIndex].textColor, // Set text color dynamically
//           }}
//         >
//           <div className="box-content">
//             <Typewriter
//               options={{
//                 strings: [typewriterContents[currentIndex].text],
//                 autoStart: true,
//                 // loop: false, // Ensures content does not repeat
//                 delay: 30,
//                 // deleteSpeed: 0, // Prevents content from deleting
//                 onStart: () => setIsTyping(true),
//                 onComplete: () => {
//                   // Pause after typing is complete
//                   // setPaused(true);
//                   setTimeout(() => {
//                     // setPaused(false);
//                     // setIsTyping(false);
//                     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//                  setPaused(true);
//                     setIsTyping(false);
//                   }, 10000); // 10000ms = 10 seconds
//                 },
//               }}
//               onInit={(typewriter) => {
//                 // Optionally, stop the typing after 5 seconds or any condition
//                 setTimeout(() => {
//                   stopTypewriting(typewriter); // Stop the typewriter effect at a specific time
//                 }, 5000); // Stop after 5 seconds, you can adjust this condition
//               }}
//             />
//           </div>
//         </div>

//         {/* Scrolling Buttons */}
//         <div className="scrolling-buttons">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               className={`scroll-btn ${index === currentIndex ? 'active' : ''}`}
//               onClick={() => handleScrollButtonClick(index)}
//             ></button>
//           ))}
//         </div>
//       </div>

//       <div className='HomeServices'>
//         <Services />
//       </div>
//       <div className='HomeServices1'>
//         <HomologationFirst />
//       </div>
//       <div className='HomeServices3'>
//         <About />
//       </div>
//     </section>
//   );
// };

// export default Home;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Typewriter from 'typewriter-effect'; // Install via `npm install typewriter-effect`
// import About from "../About/About";
// import Services from '../Services/Services';
// import HomologationFirst from '../HomologationFirst/HomologationFirst';
// import './Home.css';



// const Home = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const [paused, setPaused] = useState(false); // State to handle pause after typing
//   const navigate = useNavigate();

  

//   // Define images and content for all carousel items
//   const desktopImages = [
//     './images/H101.png',
//     './images/H106.png',
//     './images/homepage4.png',
//     './images/H105.png',
//   ];
  

//   const typewriterContents = [
//     { text: 'At STS, we specialize in providing seamless turnkey solutions that handle every aspect of your project. From initial concept to final execution, we take care of all the details so you can focus on what matters most-growing your business.  ', duration: 16000 },
//     { text: 'Let us help you innovate and grow with cutting-edge technologies.', duration: 6000 },
//     { text: 'We specialize in delivering end-to-end 3-wheeler design solutions, offering custom branding, high-quality vehicle wraps, and expert installation to enhance visibility and drive your brand forward on the road..', duration: 15000 },

//     { text: 'we support to automative activities product develop to innovative software development app creation.', duration: 8000 },
//   ];

//   const isMobile = window.innerWidth <= 768;
//   const images = desktopImages;

//   // Slide transition logic with pause
//   useEffect(() => {
//     if (paused || isTyping) return; // Don't transition while paused or typing

//     const timeout = setTimeout(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, typewriterContents[currentIndex].duration); // Duration for each slide

//     return () => clearTimeout(timeout); // Cleanup the timeout when component unmounts or dependencies change
//   }, [currentIndex, isTyping, paused]);

//   // Handle scroll button click to change slides
//   const handleScrollButtonClick = (index) => {
//     setCurrentIndex(index);
//     setPaused(false); // Reset pause when manually clicking to change slide
//   };

//   const handleLearnMoreClick = () => {
//     navigate("/MainAbout");
//   };

//   // Custom function to stop the typewriter effect at any desired point
//   const stopTypewriting = (typewriter) => {
//     // Stop the typing immediately
//     typewriter.stop();
//     setIsTyping(false);
//     setPaused(true); // Optionally, pause after stopping
//   };

//   return (
//     <section className="home123">
//       <div
//         className="hero-image"
//         style={{
//           backgroundImage: `url(${images[currentIndex]})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//         }}
//       >
//         {/* Hero Card */}
//         <div className="hero-card">
//           <h1 className="hero-card-title1">Welcome to</h1>
//           <h2 className="hero-card-title">Sukalpa Tech Solutions</h2>
//           <p className="hero-card-description">Let us join to support you deserve</p> 
//           <button className="learn-moree-btn" onClick={handleLearnMoreClick}>
//             Learn More
//           </button> 
//         </div>

//         {/* Dynamic Content Box */}
//         <div className={`dynamic-box dynamic-box-${currentIndex + 1}`}>
//           <div className="box-content">
//             <Typewriter
//               options={{
//                 strings: [typewriterContents[currentIndex].text],
//                 autoStart: true,
//                 delay: 50,
//                 onStart: () => setIsTyping(true),
//                 onComplete: () => {
//                   setTimeout(() => {
//                     setCurrentIndex((prevIndex) => {
//                       return prevIndex === typewriterContents.length - 1
//                         ? prevIndex // If it's the last index, keep it there
//                         : (prevIndex + 1) % images.length;
//                     });
//                     setPaused(true);
//                     setIsTyping(false);
//                   }, 10000); // 10000ms = 10 seconds
//                 },
//               }}
//               onInit={(typewriter) => {
//                 setTimeout(() => {
//                   stopTypewriting(typewriter);
//                 }, 5000); // Stop after 5 seconds, you can adjust this condition
//               }}
//             />
//           </div>
//         </div>

//         {/* Scrolling Buttons */}
//         <div className="scrolling-buttons">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               className={`scroll-btn ${index === currentIndex ? 'active' : ''}`}
//               onClick={() => handleScrollButtonClick(index)}
//             ></button>
//           ))}
//         </div>
//       </div>

//       <div className="HomeServices">
//         <Services />
//       </div>
//       <div className="HomeServices1">
//         <HomologationFirst />
//       </div>
//       <div className="HomeServices3">
//         <About />
//       </div>
//     </section>
//   );
// };

// export default Home;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Typewriter from 'typewriter-effect'; // Install via `npm install typewriter-effect`
// import About from "../About/About";
// import Services from '../Services/Services';
// import HomologationFirst from '../HomologationFirst/HomologationFirst';
// import './Home.css';

// const Home = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const [paused, setPaused] = useState(false); // State to handle pause after typing
//   const navigate = useNavigate();

//   // Define images for desktop and mobile views
//   const desktopImages = [
//     './images/H101.png',
//     './images/H106.png',
//     './images/homepage4.png',
//     './images/H105.png',
//   ];

//   const mobileImages = [
//     './images/H106.png',
//     './images/H101.png',
//     './images/H103.png',
//     './images/MobileImage4.png',
//   ];

//   // Check if the current view is mobile
//   const isMobile = window.innerWidth <= 768;
//   const images = isMobile ? mobileImages : desktopImages;

//   const typewriterContents = [
//     { text: 'At STS, we specialize in providing seamless turnkey solutions that handle every aspect of your project. From initial concept to final execution, we take care of all the details so you can focus on what matters most-growing your business.', duration: 16000 },
//     { text: 'Let us help you innovate and grow with cutting-edge technologies.', duration: 6000 },
//     { text: 'We specialize in delivering end-to-end 3-wheeler design solutions, offering custom branding, high-quality vehicle wraps, and expert installation to enhance visibility and drive your brand forward on the road..', duration: 15000 },
//     { text: 'We support automotive activities, from product development to innovative software app creation.', duration: 8000 },
//   ];

//   // Slide transition logic with pause
//   useEffect(() => {
//     if (paused || isTyping) return; // Don't transition while paused or typing

//     const timeout = setTimeout(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, typewriterContents[currentIndex].duration); // Duration for each slide

//     return () => clearTimeout(timeout); // Cleanup the timeout when component unmounts or dependencies change
//   }, [currentIndex, isTyping, paused]);

//   // Handle scroll button click to change slides
//   const handleScrollButtonClick = (index) => {
//     setCurrentIndex(index);
//     setPaused(false); // Reset pause when manually clicking to change slide
//   };

//   const handleLearnMoreClick = () => {
//     navigate("/MainAbout");
//   };

//   // Custom function to stop the typewriter effect at any desired point
//   const stopTypewriting = (typewriter) => {
//     // Stop the typing immediately
//     typewriter.stop();
//     setIsTyping(false);
//     setPaused(true); // Optionally, pause after stopping
//   };

//   return (
//     <section className="home123">
//       <div
//         className="hero-image"
//         style={{
//           backgroundImage: `url(${images[currentIndex]})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//         }}
//       >
//         {/* Hero Card */}
//         <div className="hero-card">
//           <h1 className="hero-card-title1">Welcome to</h1>
//           <h2 className="hero-card-title">Sukalpa Tech Solutions</h2>
//           <p className="hero-card-description">Let us join to support you deserve</p> 
//           <button className="learn-moree-btn" onClick={handleLearnMoreClick}>
//             Learn More
//           </button> 
//         </div>

//         {/* Dynamic Content Box */}
//         <div className={`dynamic-box dynamic-box-${currentIndex + 1}`}>
//           <div className="box-content">
//             <Typewriter
//               options={{
//                 strings: [typewriterContents[currentIndex].text],
//                 autoStart: true,
//                 delay: 50,
//                 onStart: () => setIsTyping(true),
//                 onComplete: () => {
//                   setTimeout(() => {
//                     setCurrentIndex((prevIndex) => {
//                       return prevIndex === typewriterContents.length - 1
//                         ? prevIndex // If it's the last index, keep it there
//                         : (prevIndex + 1) % images.length;
//                     });
//                     setPaused(true);
//                     setIsTyping(false);
//                   }, 10000); // 10000ms = 10 seconds
//                 },
//               }}
//               onInit={(typewriter) => {
//                 setTimeout(() => {
//                   stopTypewriting(typewriter);
//                 }, 5000); // Stop after 5 seconds, you can adjust this condition
//               }}
//             />
//           </div>
//         </div>

//         {/* Scrolling Buttons */}
//         <div className="scrolling-buttons">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               className={`scroll-btn ${index === currentIndex ? 'active' : ''}`}
//               onClick={() => handleScrollButtonClick(index)}
//             ></button>
//           ))}
//         </div>
//       </div>

//       <div className="HomeServices">
//         <Services />
//       </div>
//       <div className="HomeServices1">
//         <HomologationFirst />
//       </div>
//       <div className="HomeServices3">
//         <About />
//       </div>
//     </section>
//   );
// };

// export default Home;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Typewriter from 'typewriter-effect'; // Install via `npm install typewriter-effect`
// import About from "../About/About";
// import Services from '../Services/Services';
// import HomologationFirst from '../HomologationFirst/HomologationFirst';
// import './Home.css';

// const Home = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const [paused, setPaused] = useState(false); // State to handle pause after typing
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // State for mobile detection
//   const navigate = useNavigate();

//   // Define images for desktop and mobile views
//   const desktopImages = [
//     './images/H101.png',
//     './images/H106.png',
//     './images/homepage4.png',
//     './images/H105.png',
//   ];

//   const mobileImages = [
//     './images/mobile_banner_1.png',
//     './images/mobile_banner_2.png',
//     './images/mobile_banner_3.png',
//     './images/m7.png',
//   ];

//   // Update isMobile state on window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768); // Update isMobile on window resize
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   // Choose images based on device type
//   const images = isMobile ? mobileImages : desktopImages;

//   const typewriterContents = [
//     { text: 'At STS, we specialize in providing seamless turnkey solutions that handle every aspect of your project. From initial concept to final execution, we take care of all the details so you can focus on what matters most-growing your business.', duration: 15000 },
//     { text: 'We offer custom-tailored CAE services to enhance product performance, durability, and efficiency, using advanced simulations to predict real-world behavior, minimize prototypes, reduce costs, and accelerate time-to-market.', duration: 16000 },
//     { text: 'We specialize in delivering end-to-end 3-wheeler design solutions, offering custom branding, high-quality vehicle wraps, and expert installation to enhance visibility and drive your brand forward on the road..', duration: 15000 },
//     { text: 'We support automotive activities, from product development to innovative software app creation.', duration: 8000 },
//   ];

//   // Slide transition logic with pause
//   useEffect(() => {
//     if (paused || isTyping) return; // Don't transition while paused or typing

//     const timeout = setTimeout(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Ensure the cycle works for both mobile and desktop
//     }, typewriterContents[currentIndex].duration); // Duration for each slide

//     return () => clearTimeout(timeout); // Cleanup the timeout when component unmounts or dependencies change
//   }, [currentIndex, isTyping, paused, images.length]);

//   // Handle scroll button click to change slides
//   const handleScrollButtonClick = (index) => {
//     setCurrentIndex(index);
//     setPaused(false); // Reset pause when manually clicking to change slide
//   };

//   const handleLearnMoreClick = () => {
//     navigate("/MainAbout");
//   };

//   // Custom function to stop the typewriter effect at any desired point
//   const stopTypewriting = (typewriter) => {
//     typewriter.stop(); // Stop the typing immediately
//     setIsTyping(false);
//     setPaused(true); // Optionally, pause after stopping
//   };

//   return (
//     <section className="home123">
//       <div
//         className="hero-image"
//         style={{
//           backgroundImage: `url(${images[currentIndex]})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//         }}
//       >
//         {/* Hero Card */}
//         <div className="hero-card">
//           <h1 className="hero-card-title1">Welcome to</h1>
//           <h2 className="hero-card-title">Sukalpa Tech Solutions</h2>
//           <p className="hero-card-description">Let us join to support you deserve</p> 
//           <button className="learn-moree-btn" onClick={handleLearnMoreClick}>
//             Learn More
//           </button> 
//         </div>

//         {/* Dynamic Content Box */}
//         <div className={`dynamic-box dynamic-box-${currentIndex + 1}`}>
//           <div className="box-content">
//             <Typewriter
//               options={{
//                 strings: [typewriterContents[currentIndex].text],
//                 autoStart: true,
//                 delay: 50,
//                 onStart: () => setIsTyping(true),
//                 onComplete: () => {
//                   setTimeout(() => {
//                     setCurrentIndex((prevIndex) => {
//                       return prevIndex === typewriterContents.length - 1
//                         ? prevIndex // If it's the last index, keep it there
//                         : (prevIndex + 1) % images.length;
//                     });
//                     setPaused(true);
//                     setIsTyping(false);
//                   }, 10000); // 10000ms = 10 seconds
//                 },
//               }}
//               onInit={(typewriter) => {
//                 setTimeout(() => {
//                   stopTypewriting(typewriter);
//                 }, 5000); // Stop after 5 seconds, you can adjust this condition
//               }}
//             />
//           </div>
//         </div>

//         {/* Scrolling Buttons */}
//         <div className="scrolling-buttons">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               className={`scroll-btn ${index === currentIndex ? 'active' : ''}`}
//               onClick={() => handleScrollButtonClick(index)}
//             ></button>
//           ))}
//         </div>
//       </div>

//       <div className="HomeServices">
//         <Services />
//       </div>
//       <div className="HomeServices1">
//         <HomologationFirst />
//       </div>
//       <div className="HomeServices3">
//         <About />
//       </div>
//     </section>
//   );
// };

// export default Home;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Typewriter from 'typewriter-effect'; // Install via `npm install typewriter-effect`
// import About from "../About/About";
// import Services from '../Services/Services';
// import HomologationFirst from '../HomologationFirst/HomologationFirst';
// import './Home.css';
// import H101 from '../../assets/images/H101.png';
// import H106 from '../../assets/images/H106.png';
// import Homepage4 from '../../assets/images/Homepage4.png';
// import H105 from '../../assets/images/H105.png';

// const desktopImages = [H101, H106, Homepage4, H105];


// const Home = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const navigate = useNavigate();

//   // const desktopImages = [
//   //   './images/H101.png',
//   //   './images/H106.png',
//   //   './images/homepage4.png',
//   //   './images/H105.png',
//   // ];

//   const mobileImages = [
//     './images/bn1.png',
//    './images/bn2 (2).png',
//    './images/bn3 (3).png',
//    './images/bn4 (4).png',
//   ];

//   const images = isMobile ? mobileImages : desktopImages;

//   const typewriterContents = [
//     { text: 'At STS, we specialize in providing seamless turnkey solutions that handle every aspect of your project. From initial concept to final execution, we take care of all the details so you can focus on what matters most-growing your business.', duration: 16000 },
//     { text: 'We offer custom-tailored CAE services to enhance product performance, durability, and efficiency, using advanced simulations to predict real-world behavior, minimize prototypes, reduce costs, and accelerate time-to-market.', duration: 16000 },
//     { text: 'We specialize in delivering end-to-end 3-wheeler design solutions, offering custom branding, high-quality vehicle wraps, and expert installation to enhance visibility and drive your brand forward on the road.', duration: 15000 },
//     { text: 'We support automotive activities, from product development to innovative software app creation.', duration: 8000 },
//   ];

//   // Update `isMobile` on window resize
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener('resize', handleResize);

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Slide transition logic
//   useEffect(() => {
//     if (isTyping || isPaused) return;

//     const timeout = setTimeout(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, typewriterContents[currentIndex].duration);

//     return () => clearTimeout(timeout);
//   }, [currentIndex, isTyping, isPaused, images.length]);

//   // Handle manual slide change
//   const handleScrollButtonClick = (index) => {
//     setCurrentIndex(index);
//     setIsPaused(false); // Resume auto-sliding
//   };

//   const handleLearnMoreClick = () => {
//     navigate("/MainAbout");
//   };

//   return (
//     <section className="home123">
//       <div
//         className="hero-image"
//         style={{
//           backgroundImage: `url(${images[currentIndex]})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//         }}
//       >
//         {/* Hero Card */}
//         <div className="hero-card">
//           <h1 className="hero-card-title1">Welcome to</h1>
//           <h2 className="hero-card-title">Sukalpa Tech Solutions</h2>
//           <p className="hero-card-description">Let us join to support you deserve</p>
//           <button className="learn-moree-btn" onClick={handleLearnMoreClick}>
//             Learn More
//           </button>
//         </div>

//         {/* Dynamic Content Box */}
//         <div className={`dynamic-box dynamic-box-${currentIndex + 1}`}>
//           <div className="box-content">
//             <Typewriter
//               options={{
//                 strings: [typewriterContents[currentIndex].text],
//                 autoStart: true,
//                 delay: 50,
//                 onStart: () => setIsTyping(true),
//                 onComplete: () => setIsTyping(false),
//               }}
//             />
//           </div>
//         </div>

//         {/* Scrolling Buttons */}
//         <div className="scrolling-buttons">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               className={`scroll-btn ${index === currentIndex ? 'active' : ''}`}
//               onClick={() => handleScrollButtonClick(index)}
//             ></button>
//           ))}
//         </div>
//       </div>

//       {/* Additional Components */}
//       <div className="HomeServices">
//         <Services />
//       </div>
//       <div className="HomeServices1">
//         <HomologationFirst />
//       </div>
//       <div className="HomeServices3">
//         <About />
//       </div>
//     </section>
//   );
// };

// export default Home;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Typewriter from 'typewriter-effect';
// import About from "../About/About";
// import Services from '../Services/Services';
// import HomologationFirst from '../HomologationFirst/HomologationFirst';
// import './Home.css';
// import H101 from '../../assets/images/H101.png';
// import H106 from '../../assets/images/H106.png';
// import Homepage4 from '../../assets/images/Homepage4.png';
// import H105 from '../../assets/images/H105.png';

// const desktopImages = [H101, H106, Homepage4, H105];
// const mobileImages = [
//   './images/bn1.png',
//   './images/bn2 (2).png',
//   './images/bn3 (3).png',
//   './images/bn4 (4).png',
// ];

// const typewriterContents = [
//   { text: 'At STS, we specialize in providing seamless turnkey solutions that handle every aspect of your project. From initial concept to final execution, we take care of all the details so you can focus on what matters most-growing your business.', duration: 16000 },
//   { text: 'We offer custom-tailored CAE services to enhance product performance, durability, and efficiency, using advanced simulations to predict real-world behavior, minimize prototypes, reduce costs, and accelerate time-to-market.', duration: 16000 },
//   { text: 'We specialize in delivering end-to-end 3-wheeler design solutions, offering custom branding, high-quality vehicle wraps, and expert installation to enhance visibility and drive your brand forward on the road.', duration: 15000 },
//   { text: 'We support automotive activities, from product development to innovative software app creation.', duration: 8000 },
// ];

// const Home = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const navigate = useNavigate();

//   const images = isMobile ? mobileImages : desktopImages;

//   const getSlideDuration = () => {
//     if (isMobile) {
//       console.log('Mobile detected: Setting duration to 5000ms');
//       return 1000; // Mobile duration
//     }
//     const desktopDuration = typewriterContents[currentIndex]?.duration || 10000;
//     console.log(`Desktop detected: Setting duration to ${desktopDuration}ms`);
//     return desktopDuration; // Desktop duration
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       const mobileStatus = window.innerWidth <= 768;
//       console.log(`Window resized. Is mobile: ${mobileStatus}`);
//       setIsMobile(mobileStatus);
//     };
//     window.addEventListener('resize', handleResize);

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     if (isTyping || isPaused) return;

//     const duration = getSlideDuration();
//     console.log(`Slide transition duration: ${duration}ms`);

//     const timeout = setTimeout(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//       console.log(`Changing slide to index: ${(currentIndex + 1) % images.length}`);
//     }, duration);

//     return () => clearTimeout(timeout);
//   }, [currentIndex, isTyping, isPaused, images.length, isMobile]);

//   const handleScrollButtonClick = (index) => {
//     console.log(`Manual slide change to index: ${index}`);
//     setCurrentIndex(index);
//     setIsPaused(false);
//   };

//   const handleLearnMoreClick = () => {
//     navigate("/MainAbout");
//   };

//   return (
//     <section className="home123">
//       <div
//         className="hero-image"
//         style={{
//           backgroundImage: `url(${images[currentIndex]})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//         }}
//       >
//         <div className="hero-card">
//           <h1 className="hero-card-title1">Welcome to</h1>
//           <h2 className="hero-card-title">Sukalpa Tech Solutions</h2>
//           <p className="hero-card-description">Let us join to support you deserve</p>
//           <button className="learn-moree-btn" onClick={handleLearnMoreClick}>
//             Learn More
//           </button>
//         </div>

//         <div className={`dynamic-box dynamic-box-${currentIndex + 1}`}>
//           <div className="box-content">
//             <Typewriter
//               options={{
//                 strings: [typewriterContents[currentIndex]?.text || ''],
//                 autoStart: true,
//                 delay: 50,
//                 onStart: () => setIsTyping(true),
//                 onComplete: () => setIsTyping(false),
//               }}
//             />
//           </div>
//         </div>

//         <div className="scrolling-buttons">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               className={`scroll-btn ${index === currentIndex ? 'active' : ''}`}
//               onClick={() => handleScrollButtonClick(index)}
//             ></button>
//           ))}
//         </div>
//       </div>

//       <div className="HomeServices">
//         <Services />
//       </div>
//       <div className="HomeServices1">
//         <HomologationFirst />
//       </div>
//       <div className="HomeServices3">
//         <About />
//       </div>
//     </section>
//   );
// };

// export default Home;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import About from "../About/About";
import Services from '../Services/Services';
import HomologationFirst from '../HomologationFirst/HomologationFirst';
import './Home.css';
import H101 from '../../assets/images/H101.png';
import H106 from '../../assets/images/H106.png';
import Homepage4 from '../../assets/images/Homepage4.png';
import H105 from '../../assets/images/H105.png';

const desktopImages = [H101, H106, Homepage4, H105];
const mobileImages = [
  './images/bn1.png',
  './images/bn2 (2).png',
  './images/bn3 (3).png',
  './images/bn4 (4).png',
];

const typewriterContents = [
  { text: 'At STS, we specialize in providing seamless turnkey solutions that handle every aspect of your project. From initial concept to final execution, we take care of all the details so you can focus on what matters most-growing your business.', duration: 16000 },
  { text: 'We offer custom-tailored CAE services to enhance product performance, durability, and efficiency, using advanced simulations to predict real-world behavior, minimize prototypes, reduce costs, and accelerate time-to-market.', duration: 16000 },
  { text: 'We specialize in delivering end-to-end 3-wheeler design solutions, offering custom branding, high-quality vehicle wraps, and expert installation to enhance visibility and drive your brand forward on the road.', duration: 15000 },
  { text: 'We support automotive activities, from product development to innovative software app creation.', duration: 8000 },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  const images = isMobile ? mobileImages : desktopImages;

  const mobileDuration = 5000; // Fixed duration for mobile slides

  const getSlideDuration = () => {
    if (isMobile) {
      console.log('Using mobile duration:', mobileDuration); // Debugging log
      return mobileDuration;
    }
    const desktopDuration = typewriterContents[currentIndex]?.duration || 10000;
    console.log('Using desktop duration:', desktopDuration); // Debugging log
    return desktopDuration;
  };

  // Update `isMobile` on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      console.log('Is mobile:', window.innerWidth <= 768); // Debugging log
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle slide transitions
  useEffect(() => {
    if (isTyping || isPaused) return;

    const duration = getSlideDuration(); // Determine the duration based on viewport
    console.log(`Setting timeout for ${duration}ms`); // Debugging log

    const timeout = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      console.log('Slide changed to index:', (currentIndex + 1) % images.length); // Debugging log
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentIndex, isTyping, isPaused, images.length, isMobile]);

  const handleScrollButtonClick = (index) => {
    setCurrentIndex(index);
    setIsPaused(false);
    console.log('Manual slide change to index:', index); // Debugging log
  };

  const handleLearnMoreClick = () => {
    navigate("/MainAbout");
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
        <div className="hero-card">
          <h1 className="hero-card-title1">Welcome to</h1>
          <h2 className="hero-card-title">Sukalpa Tech Solutions</h2>
          <p className="hero-card-description">Let us join to support you deserve</p>
          <button className="learn-moree-btn" onClick={handleLearnMoreClick}>
            Learn More
          </button>
        </div>

        <div className={`dynamic-box dynamic-box-${currentIndex + 1}`}>
          <div className="box-content">
            <Typewriter
              options={{
                strings: [typewriterContents[currentIndex]?.text || ''],
                autoStart: true,
                delay: 50,
                onStart: () => setIsTyping(true),
                onComplete: () => setIsTyping(false),
              }}
            />
          </div>
        </div>

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

      <div className="HomeServices">
        <Services />
      </div>
      <div className="HomeServices1">
        <HomologationFirst />
      </div>
      <div className="HomeServices3">
        <About />
      </div>
    </section>
  );
};

export default Home;
