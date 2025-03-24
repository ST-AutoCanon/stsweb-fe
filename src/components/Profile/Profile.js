import React, { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";

const Profile = ({ onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // Start with an empty string; avatar will be determined by gender
  const [avatar, setAvatar] = useState("");

  const API_KEY = process.env.REACT_APP_API_KEY;
  const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  const employeeId = dashboardData.employeeId || null;

  // Helper to determine default avatar based on gender
  const getDefaultAvatar = (gender) => {
    return gender === "Female"
      ? "/images/female-avatar.jpeg"
      : "/images/male-avatar.jpeg";
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/employee/${employeeId}`,
          {
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        const profileData = response.data.data;
        setProfile(profileData);

        // If photo_url exists, try to fetch the image as blob and set it as avatar
        if (profileData.photo_url) {
          try {
            const imageResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/${profileData.photo_url}`,
              {
                headers: {
                  "x-api-key": API_KEY,
                },
                responseType: "blob",
              }
            );
            const imageUrl = URL.createObjectURL(imageResponse.data);
            setAvatar(imageUrl);
          } catch (error) {
            console.error("Error fetching photo, using default avatar:", error);
            setAvatar(getDefaultAvatar(profileData.gender));
          }
        } else {
          // No photo_url, so set avatar based on gender
          setAvatar(getDefaultAvatar(profileData.gender));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // In case of error, if profile is not fetched, the avatar remains unset
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchProfile();
    }
  }, [employeeId, API_KEY]);

  if (loading) {
    return <div className="profile-popup">Loading...</div>;
  }

  if (!profile) {
    return <div className="profile-popup">No profile data available.</div>;
  }

  return (
    <div className="profile-popup">
      <div className="profile-content">
        <MdOutlineCancel className="profile-close" onClick={onClose} />
        <div className="profile-header">
          <img src={avatar} alt="profile-photo" className="profile-photo" />
          <div className="profile-name">
            <h3>{`${profile.first_name} ${profile.last_name}`}</h3>
            <p>
              {profile.position} - {profile.department}
            </p>
            <p>Employee Id: {profile.employee_id}</p>
          </div>
        </div>
        <div className="profile-details">
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Mobile:</strong> {profile.phone_number}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(profile.dob).toLocaleDateString()}
          </p>
          <p>
            <strong>Address:</strong> {profile.address}
          </p>
          <p>
            <strong>Aadhaar Number:</strong> {profile.aadhaar_number}
          </p>
          <p>
            <strong>PAN Number:</strong> {profile.pan_number}
          </p>
          <p>
            <strong>Gender:</strong> {profile.gender}
          </p>
          <p>
            <strong>Marital Status:</strong> {profile.marital_status}
          </p>
          {profile.marital_status === "Married" && (
            <>
              <p>
                <strong>Spouse Name:</strong> {profile.spouse_name}
              </p>
              <p>
                <strong>Marriage Anniversary:</strong>{" "}
                {new Date(profile.marriage_date).toLocaleDateString()}
              </p>
            </>
          )}
          <p>
            <strong>Father's Name:</strong> {profile.father_name}
          </p>
          <p>
            <strong>Mother's Name:</strong> {profile.mother_name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;



