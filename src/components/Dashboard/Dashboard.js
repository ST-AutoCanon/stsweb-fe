import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Dashboard.css";
import axios from "axios";
import BirthdayCard from "../BirthdayCard/BirthdayCard";
import { isBirthdayToday } from "../../utils/checkBirthday";
import { ContentContext } from "./Context";
import Profile from "../Profile/Profile";
import Modal from "../Modal/Modal";

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState();
  const [showBirthday, setShowBirthday] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [profileAlert, setProfileAlert] = useState(null);

  const email = localStorage.getItem("username");
  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

  useEffect(() => {
    const fetchBirthday = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/employee/birthday/${email}`,
          { headers }
        );
        const { full_name, first_name, dob } = response.data;
        const nameToUse = full_name || first_name || "there";
        if (isBirthdayToday(dob)) {
          setEmployeeName(nameToUse);
          setShowBirthday(true);
          setTimeout(() => setShowBirthday(false), 25000);
        }
      } catch (error) {
        console.error("❌ Error fetching birthday:", error);
      }
    };

    if (email) fetchBirthday();
  }, [email]);

  useEffect(() => {
    async function fetchProfileNotifications() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/notifications`,
          { headers }
        );
        const notifications = res.data.notifications || [];
        const profileNote = notifications.find((n) => {
          const m = (n.message || "").toLowerCase();
          return (
            m.includes("profile") &&
            (m.includes("incomplete") ||
              m.includes("missing") ||
              m.includes("update"))
          );
        });
        if (profileNote) {
          setProfileAlert(profileNote);
        }
      } catch (err) {
        console.error("Error fetching notifications in dashboard", err);
      }
    }

    if (meId) fetchProfileNotifications();
  }, [meId]);

  const handleUpdateNowFromAlert = () => {
    if (!profileAlert) return;
    setActiveContent(
      <Profile
        key={`profile-notif-${profileAlert.id}`}
        onClose={() => setActiveContent(null)}
        notificationId={profileAlert.id}
      />
    );
    setProfileAlert(null);
  };

  const handleDismissAlert = () => setProfileAlert(null);

  const renderContent = () => (
    <div className="content-container-design">
      <div>{activeContent}</div>
    </div>
  );

  return (
    <ContentContext.Provider value={{ setActiveContent }}>
      <div className="Dashboard123">
        <div className="Dashboarddesign">
          <div className="dashboard">
            {showBirthday && <BirthdayCard name={employeeName} />}
            <Topbar />
            <div className="content-container">
              <Sidebar setActiveContent={setActiveContent} />
              <div className="main-content">{renderContent()}</div>
            </div>

            {profileAlert && (
              <Modal
                isVisible
                onClose={handleDismissAlert}
                buttons={[
                  { label: "Remind me later", onClick: handleDismissAlert },
                  { label: "Update Now", onClick: handleUpdateNowFromAlert },
                ]}
              >
                <div style={{ padding: 8 }}>
                  <h3>Profile Update Required</h3>
                  <p>{profileAlert.message}</p>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </ContentContext.Provider>
  );
};

export default Dashboard;
