
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";
import "./EmpDashCards.css";
import {
  FaFingerprint,
  FaRegClock,
  FaMapMarkerAlt,
  FaDesktop,
  FaMobileAlt,
} from "react-icons/fa";

const EmpDashCards = () => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const videoRef = useRef(null);

  let employeeId;
  const dashboardData = localStorage.getItem("dashboardData");

  if (dashboardData) {
    try {
      const parsedData = JSON.parse(dashboardData);
      employeeId = parsedData.employeeId;
    } catch (error) {
      console.error("Error parsing dashboardData:", error);
    }
  }

  const latestPunchApi = `${process.env.REACT_APP_BACKEND_URL}/attendance/employee/${employeeId}/latest-punch`;

  const [punchData, setPunchData] = useState({
    time: "NA",
    location: "NA",
    device: "NA",
  });
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (employeeId) {
      fetchPunchData();
      const interval = setInterval(fetchPunchData, 10000);
      return () => clearInterval(interval);
    }
    loadModels();
  }, [employeeId]);

  const fetchPunchData = async () => {
    try {
      if (!API_KEY) throw new Error("API Key is missing.");
      const response = await axios.get(latestPunchApi, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      if (response.data?.data) {
        const latestPunch = response.data.data;

        setPunchData({
          time: latestPunch.punchout_time
            ? new Date(latestPunch.punchout_time).toLocaleString()
            : latestPunch.punchin_time
            ? new Date(latestPunch.punchin_time).toLocaleString()
            : "NA",
          location:
            latestPunch.punchout_location ||
            latestPunch.punchin_location ||
            "NA",
          device:
            latestPunch.punchout_device || latestPunch.punchin_device || "NA",
        });

        setIsPunchedIn(latestPunch.punch_status === "Punch In");
      }
    } catch (error) {
      console.error("Error fetching punch data:", error);
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = `${process.env.PUBLIC_URL}/models`;

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      console.log("Face-api models loaded");
    };

    loadModels();
  }, []);

  


  const getLocationAndDevice = async () => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            return resolve({
                latitude: "N/A",
                longitude: "N/A",
                location: "Geolocation not supported",
                googleMapsLink: "N/A",
                device: getDeviceType(),
            });
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log("GeolocationPosition:", position);
                const { latitude, longitude } = position.coords;

                const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18`
                    );

                    if (!response.ok) throw new Error(`API error: ${response.status}`);

                    const data = await response.json();
                    console.log("Reverse Geocode Data:", data);

                    let location = "Unknown";
                    if (data && data.address) {
                        const { road, suburb, town, city, county, state, postcode } = data.address;
                        location = [road, suburb, town, city, county, state, postcode].filter(Boolean).join(", ");
                    }

                    resolve({ latitude, longitude, location, googleMapsLink, device: getDeviceType() });
                } catch (error) {
                    console.error("Error fetching address:", error);
                    resolve({ latitude, longitude, location: "Unknown", googleMapsLink, device: getDeviceType() });
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                let errorMessage = "Unable to retrieve location";

                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = "User denied location access. Please allow location permission.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = "Location information is unavailable.";
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = "please turn on your location.";
                }

                resolve({
                    latitude: "N/A",
                    longitude: "N/A",
                    location: errorMessage,
                    googleMapsLink: "N/A",
                    device: getDeviceType(),
                });
            },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 5000 }
        );
    });
};


  // Helper function to detect device type
  const getDeviceType = () => (/Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop");
  
  // Call the function
  getLocationAndDevice().then((data) => console.log("Location Data:", data));
  

  getLocationAndDevice().then(console.log);


  const isCameraAvailable = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInput = devices.some((device) => device.kind === "videoinput");
      return videoInput;
    } catch (err) {
      console.error("Error checking camera availability:", err);
      return false;
    }
  };
  




  


  const verifyFace = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      await new Promise((res) => setTimeout(res, 2000));

      let attempts = 0;
      let detection = null;

      while (attempts < 10 && !detection) {
        detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          await new Promise((res) => setTimeout(res, 1000));
          attempts++;
        }
      }

      if (!detection) {
        return { success: false, error: "Face not detected" };
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/face-data/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );

      const storedDescriptors = response.data.descriptors || [];

      if (storedDescriptors.length === 0) {
        return { success: false, error: "Please register your face then proceed with this" };
      }

      let bestMatch = false;

      for (let stored of storedDescriptors) {
        let storedDescriptor;

        try {
          if (typeof stored === "string") {
            stored = JSON.parse(stored);
          }

          if (typeof stored === "object" && stored !== null) {
            const values = Object.keys(stored)
              .sort((a, b) => Number(a) - Number(b))
              .map((key) => parseFloat(stored[key]));

            if (values.length !== 128) {
              console.warn("Invalid descriptor length:", values.length);
              continue;
            }

            storedDescriptor = new Float32Array(values);
          } else if (Array.isArray(stored)) {
            storedDescriptor = new Float32Array(stored);
          } else {
            throw new Error("Stored descriptor is not a valid array or object");
          }

          if (storedDescriptor.length !== 128) {
            console.warn("Invalid descriptor length:", storedDescriptor.length);
            continue;
          }

          const distance = faceapi.euclideanDistance(
            detection.descriptor,
            storedDescriptor
          );

          console.log("Distance:", distance);

          if (distance < 0.4) {
            bestMatch = true;
            break;
          }
        } catch (err) {
          console.error("Error verifying descriptor:", err);
        }
      }

      if (!bestMatch) {
        return { success: false, error: "Face not matched" };
      }

      return { success: true };
    } catch (err) {
      console.error("Face verification failed:", err);
      return { success: false, error: err.message || "Face verification failed" };
    } finally {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setShowCamera(false);
    }
  };

  const handlePunch = async () => {
    if (!API_KEY || !employeeId) {
      setErrorMessage("Session expired or employee ID missing.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const hasCamera = await isCameraAvailable();
    let faceResult = { success: true };

    if (hasCamera) {
      faceResult = await verifyFace();
    } else {
      console.warn("No camera found. Skipping face verification.");
    }

    if (!faceResult.success) {
      setLoading(false);
      setErrorMessage(faceResult.error || "Face verification failed. Try again.");
      return;
    }

    try {
      const { location, device } = await getLocationAndDevice();

      const apiUrl = isPunchedIn
        ? `${process.env.REACT_APP_BACKEND_URL}/attendance/punch-out`
        : `${process.env.REACT_APP_BACKEND_URL}/attendance/punch-in`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          employeeId,
          device,
          location,
          punchMode: "Manual",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsPunchedIn(!isPunchedIn);
        fetchPunchData();
      } else {
        setErrorMessage(data.message || "Punch-in failed");
      }
    } catch (error) {
      setErrorMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of the component, including JSX, remains unchanged)

  return (
    <div className="emp-dash-cards">
      {showCamera && (
        <div className="camera-popup">
          <h3 className="camera-title">Face Verification</h3>
          <video ref={videoRef} autoPlay muted className="camera-video" />
          <p className="camera-status">Verifying face, please wait...</p>
        </div>
      )}

      <button
        className={`emp-card emp-punch-in ${
          isPunchedIn ? "emp-punched-out" : ""
        }`}
        onClick={handlePunch}
        disabled={loading}
      >
        <div className="emp-card-content">
          <FaFingerprint className="emp-icon" />
          <div>
            <span className="emp-text">
              {loading ? "Verifying..." : isPunchedIn ? "Punch Out" : "Punch In"}
            </span>
          </div>
        </div>
      </button>

      <div className="emp-card">
        <div className="emp-card-content">
          <FaRegClock className="emp-icon" />
          <div>
            <span className="emp-text">{punchData.time}</span>
            <span className="emp-label">Time</span>
          </div>
        </div>
      </div>

     


<div className="emp-card">
  <div className="emp-card-content">
    <FaMapMarkerAlt className="emp-icon" />
    <div>
      <span className="emp-text">{punchData.location}</span>
      <span className="emp-label">Location</span>

      {/* Info note */}
      {/* <div className="location-info-note">
        (Note: In desktop, location is based on your IP address.)
      </div> */}

      {punchData.location !== "NA" && (
        <a 
          href={
            punchData.latitude && punchData.longitude 
              ? `https://www.google.com/maps?q=${punchData.latitude},${punchData.longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(punchData.location)}`
          } 
          target="_blank" 
          rel="noopener noreferrer" 
          className="location-link"
        >
          View Location
        </a>
      )}
    </div>
  </div>
</div>

      <div className="emp-card">
        <div className="emp-card-content">
          {punchData.device === "Mobile" ? (
            <FaMobileAlt className="emp-icon" />
          ) : (
            <FaDesktop className="emp-icon" />
          )}
          <div>
            <span className="emp-text">{punchData.device}</span>
            <span className="emp-label">Device</span>
          </div>
        </div>
      </div>

      {errorMessage && <p className="error-text">{errorMessage}</p>}
    </div>
  );
};

export default EmpDashCards;