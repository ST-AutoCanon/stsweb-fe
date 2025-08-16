import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";
import "./Profile.css";
import Modal from "../Modal/Modal";
import UpdateProfile from "./UpdateProfileEmployee";

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

  const [showUpdateModal, setShowUpdateModal] = useState(false);

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

  // ---------- Helpers ----------
  const normalizeInputUrl = (maybe) => {
    // Accept string, object with .url/.path, arrays, etc.
    if (!maybe && maybe !== 0) return null;

    if (typeof maybe === "string") return maybe;
    if (Array.isArray(maybe) && maybe.length)
      return normalizeInputUrl(maybe[0]);
    if (typeof maybe === "object") {
      // common shapes
      if (typeof maybe.url === "string" && maybe.url) return maybe.url;
      if (typeof maybe.path === "string" && maybe.path) return maybe.path;
      if (typeof maybe.file === "string" && maybe.file) return maybe.file;
      // fallback to JSON string (won't be a valid fetch URL, but at least won't crash)
      try {
        return JSON.stringify(maybe);
      } catch {
        return String(maybe);
      }
    }
    // fallback
    return String(maybe);
  };

  const getSafeFilename = (maybeUrl) => {
    const u = normalizeInputUrl(maybeUrl);
    if (!u) return "document";

    try {
      // if it's an absolute URL, use URL to parse pathname
      if (u.startsWith("http://") || u.startsWith("https://")) {
        try {
          const pathname = new URL(u).pathname || "";
          return decodeURIComponent(pathname.split("/").pop() || "document");
        } catch (e) {
          /* fallthrough */
        }
      }
      // treat as path-like
      const last = u.split("/").pop() || "document";
      return decodeURIComponent(last.replace(/[?#].*$/, "")); // remove queries/hashes
    } catch (e) {
      return "document";
    }
  };

  const buildFetchUrl = (maybeUrl) => {
    // returns a URL string you can pass to axios.get
    const u = normalizeInputUrl(maybeUrl);
    if (!u) return null;

    // If it already looks absolute, use it
    if (u.startsWith("http://") || u.startsWith("https://")) return u;

    // if already starts with /docs, no need to add base again
    if (u.startsWith("/docs")) {
      // handle when backend expects exact full path (you may choose to strip /docs)
      return `${BASE_URL}${u}`; // e.g. BASE_URL + /docs/...
    }

    // ensure it starts with '/'
    const path = u.startsWith("/") ? u : `/${u}`;

    // final: prefix with /docs
    return `${BASE_URL}/docs${path}`;
  };

  // ---------- view & download ----------
  const viewDoc = async (maybeUrl) => {
    const raw = normalizeInputUrl(maybeUrl);
    if (!raw) return showAlert("No document URL");

    console.log("viewDoc called with:", maybeUrl);

    try {
      const fetchUrl = buildFetchUrl(maybeUrl);
      if (!fetchUrl) return showAlert("Invalid document URL");

      const resp = await axios.get(fetchUrl, {
        responseType: "arraybuffer",
        headers: {
          "x-api-key": API_KEY,
          "x-employee-id": employeeId,
        },
      });

      const contentType =
        resp.headers["content-type"] || "application/octet-stream";
      const blob = new Blob([resp.data], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      // open the blob for viewing
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (err) {
      console.error("viewDoc error:", err, { maybeUrl });
      showAlert("Failed to view document");
    }
  };

  const downloadDoc = async (maybeUrl) => {
    const raw = normalizeInputUrl(maybeUrl);
    if (!raw) return showAlert("No document URL");

    console.log("downloadDoc called with:", maybeUrl);

    try {
      const fetchUrl = buildFetchUrl(maybeUrl);
      if (!fetchUrl) return showAlert("Invalid document URL");

      const resp = await axios.get(fetchUrl, {
        responseType: "arraybuffer",
        headers: {
          "x-api-key": API_KEY,
          "x-employee-id": employeeId,
        },
      });

      const contentType =
        resp.headers["content-type"] || "application/octet-stream";
      const blob = new Blob([resp.data], { type: contentType });
      const objectUrl = URL.createObjectURL(blob);

      const filename = getSafeFilename(maybeUrl);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);

      // Some browsers prefer dispatchEvent for trusted click in some contexts:
      a.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      a.remove();
      setTimeout(() => {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch (e) {}
      }, 60_000);
    } catch (err) {
      console.error("downloadDoc error:", err, { maybeUrl });
      showAlert("Failed to download document");
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

  const handleProfileSaved = (updatedProfile) => {
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
    setShowUpdateModal(false);
    setAlertModal({
      isVisible: true,
      message: "Profile updated successfully.",
    });
  };

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
                onClick={() => setShowUpdateModal(true)}
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

      {showUpdateModal && (
        <UpdateProfile
          profile={profile}
          isVisible={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSaved={handleProfileSaved}
          employeeId={employeeId}
        />
      )}
    </div>
  );
};

export default Profile;
