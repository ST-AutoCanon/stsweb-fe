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
import Login from './components/Login/Login';
import AdminPage from './components/AdminPage/AdminPage';
import EmployeePage from'./components/EmployeePage/EmployeePage';
import ITNetworkingServices from './components/ITNetworkingServices/ITNetworkingServices';
import OtherServices from './components/OtherServices/OtherServices';
import HomologationSupport from './components/HomologationSupport/HomologationSupport1';
import ConsultingServices from './components/ConsultingServices/ConsultingServices';
import EngineeringServices from './components/EngineeringServices/EngineeringServices';
//import CAEAnalysis from './components/CAEAnalysis/CAEAnalysis';
import Prototyping from './components/Prototyping/Prototyping';
import ValueEngineering from './components/ValueEngineering/ValueEngineering';
import ReverseEngineering from './components/ReverseEngineering/Reverseengineering';
import Tooling from './components/Tooling/Tooling';
import MainAbout from './components/MainAbout/MainAbout';
import CardLayout from './components/CardLayout/CardLayout';
//import CircularDesign from './components/CircularDesign/CircularDesign';

import './App.css';
import MajorProjects from './components/MajorProjects/MajorProjects';

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
          <Route path="/AdminPage" element={<AdminPage/>} />
          <Route path="/EmployeePage" element={<EmployeePage />} />
          <Route path="/MainAbout" element={<MainAbout/>}/>
          <Route path="/OtherServices" element={<OtherServices/>}/>
          <Route path="/ValueEngineering" element={<ValueEngineering/>}/>
          <Route path="/EngineeringServices" element={<EngineeringServices/>}/>
          <Route path="/Prototyping" element={<Prototyping/>}/>
          <Route path="/ReverseEngineering" element={<ReverseEngineering/>}/>
          <Route path="/ITNetworkingServices" element={<ITNetworkingServices/>}/>
          {/* <Route path="/2D&3DDrafting" element={<2D&3DDrafting/>}/> */}
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
