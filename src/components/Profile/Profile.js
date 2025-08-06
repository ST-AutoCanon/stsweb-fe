import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";
import "./Profile.css";
import Modal from "../Modal/Modal";

const TABS = ["Personal Info", "Professional Info"];

const Profile = ({ onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: "",
  });
  const [activeTab, setActiveTab] = useState(0);

  const showAlert = (message) => setAlertModal({ isVisible: true, message });
  const closeAlert = () => setAlertModal({ isVisible: false, message: "" });

  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  const employeeId = dashboardData.employeeId || null;

  const fetchBlob = async (url) => {
    const res = await axios.get(`${BASE_URL}/docs${url}`, {
      headers: { "x-api-key": API_KEY, "x-employee-id": employeeId },
      responseType: "blob",
    });
    return new Blob([res.data], { type: res.headers["content-type"] });
  };

  const downloadDoc = async (url) => {
    try {
      const blob = await fetchBlob(url);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      showAlert("Failed to download document");
    }
  };

  const viewDoc = async (url) => {
    try {
      const blob = await fetchBlob(url);
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      showAlert("Failed to view document");
    }
  };

  const getDefaultAvatar = (gender) =>
    gender === "Female"
      ? "/images/female-avatar.jpeg"
      : "/images/male-avatar.jpeg";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const r = await axios.get(`${BASE_URL}/full/${employeeId}`, {
          headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
        });
        const data = r.data.data;
        setProfile(data);
        if (data.photo_url) {
          try {
            const blob = await fetchBlob(data.photo_url);
            setAvatar(URL.createObjectURL(blob));
          } catch {
            setAvatar(getDefaultAvatar(data.gender));
          }
        } else {
          setAvatar(getDefaultAvatar(data.gender));
        }
      } catch {
        showAlert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    const fetchAssets = async () => {
      try {
        const r = await axios.get(
          `${BASE_URL}/api/assets/assigned-assets/${employeeId}`,
          { headers: { "x-api-key": API_KEY, "x-employee-id": employeeId } }
        );
        setAssignedAssets(r.data.data || []);
      } catch {
        showAlert("Failed to load assets");
      }
    };
    if (employeeId) {
      fetchProfile();
      fetchAssets();
    }
  }, [employeeId]);

  if (loading) return <div className="profile-popup">Loading...</div>;
  if (!profile) return <div className="profile-popup">No data.</div>;

  return (
    <div className="profile-popup">
      <div className="profile-content">
        <div className="profile-header">
          <img src={avatar} alt="profile-photo" className="profile-photo" />
          <div className="profile-name">
            <h3>{`${profile.first_name} ${profile.last_name}`}</h3>
            <p className="info-secondary">
              {profile.position} - {profile.department}
            </p>
            <p className="info-secondary">ID: {profile.employee_id}</p>
          </div>
          <MdOutlineCancel className="profile-close" onClick={onClose} />
        </div>

        <div className="tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === i ? "active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 0 ? (
          <div className="tab-panel personal-grid">
            <div className="update-profile-btn-wrapper">
              <button
                className="update-profile-btn"
                onClick={() =>
                  setAlertModal({
                    isVisible: true,
                    message: "Update Profile Modal (To be implemented)",
                  })
                }
              >
                Update Profile
              </button>
            </div>
            <div className="field-pair">
              <div className="field-row">
                <span className="field-label">Mobile</span>
                <span className="field-value">{profile.phone_number}</span>
              </div>
              <div className="field-row">
                <span className="field-label">DOB</span>
                <span className="field-value">
                  {new Date(profile.dob).toLocaleDateString()}
                </span>
              </div>
              <div className="field-row">
                <span className="field-label">Gender</span>
                <span className="field-value">{profile.gender}</span>
              </div>
              <div className="field-row">
                <span className="field-label">Marital Status</span>
                <span className="field-value">{profile.marital_status}</span>
              </div>

              {profile.marital_status === "Married" && (
                <>
                  <div className="field-row">
                    <span className="field-label">Spouse</span>
                    <span className="field-value">{profile.spouse_name}</span>
                  </div>
                  <div className="field-row">
                    <span className="field-label">Anniversary</span>
                    <span className="field-value">
                      {new Date(profile.marriage_date).toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}

              <div className="field-row">
                <span className="field-label">Father's Name</span>
                <span className="field-value">{profile.father_name}</span>
              </div>
              <div className="field-row">
                <span className="field-label">Mother's Name</span>
                <span className="field-value">{profile.mother_name}</span>
              </div>
            </div>

            <div className="field-row full-width">
              <span className="field-label">Email</span>
              <span className="field-value">{profile.email}</span>
            </div>
            <div className="field-row full-width">
              <span className="field-label">Address</span>
              <span className="field-value">{profile.address}</span>
            </div>
          </div>
        ) : (
          <div className="tab-panel">
            <div className="sub-block">
              <div className="field-row">
                <span className="field-label">Assigned Supervisor</span>
                <span className="field-value">{profile.supervisor_name}</span>
              </div>
              <div className="field-row assets-row">
                <span className="field-label">Assigned Assets</span>
                <span className="field-value assets-list">
                  {assignedAssets.length > 0
                    ? assignedAssets.map((a) => a.asset_code).join(", ")
                    : "None"}
                </span>
              </div>
            </div>
            <div className="sub-block docs-block">
              <span className="documents">
                <strong>Documents</strong>
              </span>
              {[
                ["Aadhaar", profile.aadhaar_doc_url],
                ["PAN", profile.pan_doc_url],
                ["Insurance", profile.insurance_doc],
              ].map(([label, url]) => (
                <div className="field-row docs-row" key={label}>
                  <span className="field-label">{label}</span>
                  {url && (
                    <span className="doc-actions">
                      <button onClick={() => viewDoc(url)}>View</button>
                      <button onClick={() => downloadDoc(url)}>Download</button>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {alertModal.isVisible && (
        <Modal
          isVisible
          onClose={closeAlert}
          buttons={[{ label: "OK", onClick: closeAlert }]}
        >
          <p>{alertModal.message}</p>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
