// /*import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar/Navbar';
// import Services from './components/Services/Services';
// import Homologation from './components/Homologation/Homologation';

// import Footer from './components/Footer/Footer';
// import Page4 from './components/Page4/Page';
// import './App.css';

// function App() {
//   return (

//     <div className="App">
      
//       <div className='Navbar'><Navbar /></div>
    
//       {/* Hero Image Section */}
//       <div className="hero-image">
//         <img
//           src="./images/banner.png"
//           alt="Hero Background"
//           className="hero-img" // Optional: Add a class for styling if needed
//         />
      
        
//         {/* Card in the Hero Section */}
//         <div className="hero-card">
//           <h2 className="hero-card-title">Welcome to Sukalpa Tech</h2>
//           <p className="hero-card-description">
//             Innovative solutions that drive your business forward.
//           </p>
//           <button className="learn-moree-btn">Learn More</button>
//         </div>
//       </div>
//       {/* Scrolling Buttons */}
//       <div className="scrolling-buttons">
//           <button className="scroll-btn"></button>
//           <button className="scroll-btn"></button>
//           <button className="scroll-btn"></button>
//           <button className="scroll-btn"></button>
//         </div>
//         <div className="App">
//       {/* Other components */}
      
//     </div>
  
//       <Services />
//       <Homologation />
//       <Page4 />
//       <div className='Footer'><Footer /></div>
//     </div>
//   );
// }

// export default App;
// */





import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Services from './components/Services/Services';
import Homologation from './components/Homologation/Homologation';
import Footer from './components/Footer/Footer';
import About from './components/About/About';
import ReachUs from './components/ReachUs/ReachUs';
import KnowMore from './components/KnowMore/KnowMore';
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard"; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <Navbar />
        
       

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
        
          <Route path="/About" element={<About />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Homologation" element={<Homologation />} />
          <Route path="/ReachUs" element={<ReachUs />} />
          <Route path="/KnowMore" element={<KnowMore />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<h1>Forgot Password Page</h1>} />

        </Routes>
       

        {/* Other Components */}
        
        
        <Services />
        <Homologation />
        <About />
        <KnowMore />
        <ReachUs />
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
