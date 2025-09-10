// import React from "react";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import ScrollToTop from "./components/ScrollTop/ScrollToTop.js";
import Services from "./components/Services/Services";
import Homologation from "./components/Homologation/Homologation";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import ReachUs from "./components/ReachUs/ReachUs";
import KnowMore from "./components/KnowMore/KnowMore";
import Login from "./components/Login/Login";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import ITNetworkingServices from "./components/ITNetworkingServices/ITNetworkingServices";
import OtherServices from "./components/OtherServices/OtherServices";
import HomologationSupport from "./components/HomologationSupport/HomologationSupport1";
import ConsultingServices from "./components/ConsultingServices/ConsultingServices";
import EngineeringServices from "./components/EngineeringServices/EngineeringServices";
//import CAEAnalysis from './components/CAEAnalysis/CAEAnalysis';
import Prototyping from "./components/Prototyping/Prototyping";
import ValueEngineering from "./components/ValueEngineering/ValueEngineering";
// import ReverseEngineering from './components/ReverseEngineering/Reverseengineering';
import Tooling from "./components/Tooling/Tooling";
import MainAbout from "./components/MainAbout/MainAbout";
import CardLayout from "./components/CardLayout/CardLayout";
//import CircularDesign from './components/CircularDesign/CircularDesign';
import OtherServiceFirst from "./components/OtherServiceFirst/OtherServiceFirst";

import "./App.css";
import MajorProjects from "./components/MajorProjects/MajorProjects";
import ITNetworkFirst from "./components/ITNetworkFirst/ITNetworkFirst";
import EngineeringServiceFirst from "./components/EngineeringServiceFirst/EngineeringServiceFirst";
import ChatbotApplication from "./components/ChatbotApplication/ChatbotApplication";
import ITConsulting from "./components/ITConsulting/ITConsulting";
import SoftwareDevelopment from "./components/SoftwareDevelopment/SoftwareDevelopment";
import ThreeDModeling from "./components/ThreeDModeling/ThreeDModeling";
import TestingAndQA from "./components/TestingAndQA/TestingAndQA";
import WebsiteDesign from "./components/WebsiteDesign/WebsiteDesign";
import CircularDesignEngg from "./components/CircularDesignEngg/CircularDesignEngg";
import CAEAnalysis from "./components/CAEAnalysis/CAEAnalysis";
import StylingProductDesign from "./components/StylingProductDesign/StylingProductDesign";
import Drafting from "./components/Drafting/Drafting";
import StaffingAndTrainingServices from "./components/StaffingAndTrainingServices/StaffingAndTrainingServices";
import PlantLayoutPlanningServices from "./components/PlantLayoutAndPlanningServices/PlantLayoutAndPlanningServices";
import Reachusfirst from "./components/Reachusfirst/Reachusfirst";
import Broucher from "./components/Broucher/Broucher";
import Gallery from "./components/Gallery/Gallery";
import HomologationFirst from "./components/HomologationFirst/HomologationFirst";
import KnowMoreFirstPage from "./components/KnowMoreFirstPage/KnowMoreFirstPage.js";
import CircularDesignNew from "./components/CircularDesignNew/CircularDesignNew";
import "./App.css";
import Broucherfirst from "./components/Broucherfirst/Broucherfirst";
import Feedbackform from "./components/Feedbackform/Feedbackform";

import ProtectedLayout from "./components/Login/ProtecttedLayout";
import Dashboard from "./components/Dashboard/Dashboard.js";
import Sidebar from "./components/Dashboard/Sidebar.js";
import Topbar from "./components/Dashboard/Topbar.js";
import Profile from "./components/Profile/Profile.js";

import LoginChart from "./components/MyDashboard/LoginChart.js";

import MyEmpDashboard from "./components/MyEmpDashboard/MyEmpDashboard.js";
import EmpDashcards from "./components/MyEmpDashboard/EmpDashCards.js";
import EmpSessions from "./components/MyEmpDashboard/EmpSessions.js";
import EmpWorkDays from "./components/MyEmpDashboard/EmpWorkDays.js";
import EmpReImbursement from "./components/MyEmpDashboard/EmpReImbursement.js";

import SalaryStatement from "./components/Salary_statement/Salary_Statement.js";
import FacePunch from "./components/FacePunch/FacePunch.js";

import GeneratePayslip from "./components/generate_payslip/generate_payslip.js";


// import EMobilitySolutions from "./components/EMobilitySolutions/EMobilitySolutions";
function App() {
   
  // Helper function to convert base64 to Uint8Array
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  useEffect(() => {
  let isMounted = true; // Prevent duplicate calls in Strict Mode
  let subscriptionInterval;

  function scheduleTestTrigger(secondsFromNow) {
    const now = new Date();
    const triggerTime = new Date(now.getTime() + secondsFromNow * 1000);

    const timeUntilTrigger = triggerTime.getTime() - now.getTime();

    setTimeout(() => {
      checkSubscription(); // Call backend immediately
      console.log(`Test trigger executed at: ${new Date().toLocaleTimeString()}`);
      // Repeat every 24 hours
      setInterval(checkSubscription, 24 * 60 * 60 * 1000);
    }, timeUntilTrigger);
  }

  async function initPush() {
    if (!isMounted) return; 
    console.log('Executing initPush');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return;
      }

      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);

      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('Existing subscription found:', existingSubscription.toJSON());
        const res = await fetch('https://sts-test.site/api/check-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: existingSubscription.endpoint }),
        });
        const { exists } = await res.json();
        if (exists) {
          console.log('Subscription still valid on server');
          return;
        }
        console.log('Subscription not found on server, resubscribing');
      }

      const vapidResponse = await fetch('https://sts-test.site/api/vapidPublicKey');
      if (!vapidResponse.ok) {
        throw new Error(`Failed to get VAPID key: ${vapidResponse.status}`);
      }
      const { publicKey } = await vapidResponse.json();

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      console.log('Push subscription object:', subscription.toJSON());
      console.log('Sending payload to /subscribe:', JSON.stringify(subscription.toJSON()));

      const res = await fetch('https://sts-test.site/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Subscription failed: ${errorText}`);
      }

      console.log('Push subscription successful');
    } catch (err) {
      console.error('Push init error:', err);
    }
  }

  async function checkSubscription() {
    if (!isMounted) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const res = await fetch('https://sts-test.site/api/check-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        const { exists } = await res.json();
        if (!exists) {
          console.log('Subscription not found on server, reinitializing');
          await initPush();
        }
      }
    } catch (err) {
      console.error('Subscription check error:', err);
    }
  }

  initPush();
  subscriptionInterval = setInterval(checkSubscription, 1 * 60 * 1000); // Check every 5 minutes

  // ✅ Test: Trigger backend call 30 seconds after load
  scheduleTestTrigger(30);

  return () => {
    isMounted = false;
    clearInterval(subscriptionInterval);
  };
}, []);

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <Navbar />
        <ScrollToTop />
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/ScrollTop" element={<ScrollToTop />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Homologation" element={<Homologation />} />
          <Route path="/ReachUs" element={<ReachUs />} />
          <Route path="/KnowMore" element={<KnowMore />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/MainAbout" element={<MainAbout />} />
          <Route path="/OtherServices" element={<OtherServices />} />
          <Route path="/ITNetworkFirst" element={<ITNetworkFirst />} />
          <Route path="/ValueEngineering" element={<ValueEngineering />} />
          <Route
            path="/EngineeringServiceFirst"
            element={<EngineeringServiceFirst />}
          />
          <Route path="/OtherServiceFirst" element={<OtherServiceFirst />} />
          <Route path="/ChatbotApplication" element={<ChatbotApplication />} />
          <Route path="/ITConsulting" element={<ITConsulting />} />
          <Route path="/ThreeDModeling" element={<ThreeDModeling />} />
          <Route
            path="/SoftwareDevelopment"
            element={<SoftwareDevelopment />}
          />
          <Route path="/TestingAndQA" element={<TestingAndQA />} />
          <Route path="/WebsiteDesign" element={<WebsiteDesign />} />
          <Route path="/CircularDesignEngg" element={<CircularDesignEngg />} />
          <Route path="/CAEAnalysis" element={<CAEAnalysis />} />
          <Route path="/Drafting" element={<Drafting />} />
          <Route
            path="/StaffingAndTraining"
            element={<StaffingAndTrainingServices />}
          />
          <Route
            path="/StylingProductDesign"
            element={<StylingProductDesign />}
          />
          <Route
            path="/PlantLayoutAndPlanningServices"
            element={<PlantLayoutPlanningServices />}
          />
          <Route path="/CircularDesignNew" element={<CircularDesignNew />} />
          <Route path="/Brouchure" element={<Broucher />} />
          <Route path="/Broucherfirst" element={<Broucherfirst />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/ReachUs" element={<ReachUs />} />
          <Route path="/Reachusfirst" element={<Reachusfirst />} />
          <Route path="/HomologationFirst" element={<HomologationFirst />} />
          <Route path="/Feedbackform" element={<Feedbackform />} />
          <Route path="/KnowMoreFirstPage" element={<KnowMoreFirstPage />} />
          <Route path="/Broucher" element={<Broucher />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Sidebar" element={<Sidebar />} />
            <Route path="/Topbar" element={<Topbar />} />
            <Route path="/Profile" element={<Profile />} />
          </Route>

          <Route path="/LoginChart" element={<LoginChart />} />
          <Route path="/MyEmpDashboard" element={<MyEmpDashboard />} />
          <Route path="/EmpDashCards" element={<EmpDashcards />} />

          <Route path="/EmpSessions" element={<EmpSessions />} />
          <Route path="/EmpWorkDays" element={<EmpWorkDays />} />
          <Route path="/EmpReImbursement" element={<EmpReImbursement />} />
          <Route path="/Salary_Statement" element={<SalaryStatement />} />
                     <Route path="/FacePunch" element={<FacePunch />} />
          <Route path="/generate_payslip" element={<GeneratePayslip/>} />

          <Route
            path="/EngineeringServices"
            element={<EngineeringServices />}
          />
          <Route path="/Prototyping" element={<Prototyping />} />
          <Route
            path="/ITNetworkingServices"
            element={<ITNetworkingServices />}
          />
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        {/* Footer */}
        {/* <HomologationFirst /> */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
