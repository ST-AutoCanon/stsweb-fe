
import React, { useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import "./SaveFaceData.css";
import Modal from "../Modal/Modal";

function SaveFaceData({ onClose }) {
  const [userName, setUserName] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Alert modal state (no title by default)
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  // Helper functions for the alert modal
  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  useEffect(() => {
    const dashboardData = localStorage.getItem("dashboardData");
    if (dashboardData) {
      try {
        const parsedData = JSON.parse(dashboardData);
        if (parsedData.employeeId) {
          setUserName(parsedData.employeeId.toString());
        } else {
          showAlert("Employee ID not found in dashboard data.");
        }
      } catch (error) {
        console.error("Error parsing dashboardData:", error);
        showAlert("Invalid dashboard data in localStorage.");
      }
    } else {
      showAlert("Dashboard data not found in localStorage.");
    }

    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
        showAlert("Error initializing face recognition models.");
      }
    };

    loadModels();
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some((device) => device.kind === "videoinput");
    } catch (error) {
      console.error("Error checking camera:", error);
      return false;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startCamera = () => {
    const video = document.getElementById("video");
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            resolve();
          };
        })
        .catch((error) => {
          console.error("Camera error:", error);
          showAlert("Could not access camera");
          reject(error);
        });
    });
  };

  const stopCamera = () => {
    const video = document.getElementById("video");
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const captureFaceData = async () => {
    if (!modelsLoaded) {
      showAlert("Models not loaded yet.");
      return;
    }

    if (!userName.trim()) {
      showAlert("Employee ID not found.");
      return;
    }

    const hasCamera = await checkCameraAvailability();
    if (!hasCamera) {
      showAlert(
        "No camera found on this device. Proceeding without capturing face."
      );
      return;
    }

    try {
      const API_KEY = process.env.REACT_APP_API_KEY;
      const meId = JSON.parse(
        localStorage.getItem("dashboardData") || "{}"
      ).employeeId;
      const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

      const checkResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/face/check/${userName}`,
        {
          headers,
        }
      );
      const checkData = await checkResponse.json();
      console.log("Check response:", checkData);

      if (checkData.exists) {
        showAlert("Face data already exists for this Employee ID.");
        return;
      }

      if (checkData.count > 1) {
        showAlert(
          `Multiple entries found for Employee ID ${userName}. Cannot capture face data.`
        );
        return;
      }
    } catch (error) {
      console.error("Error checking existing face data:", error);
      showAlert("Failed to check existing face data. Please try again.");
      return;
    }

    setIsCapturing(true);
    await startCamera();

    const video = document.getElementById("video");
    const container = document.querySelector(".save-face-container");
    const canvas = faceapi.createCanvasFromMedia(video);
    canvas.id = "captureCanvas";
    container.appendChild(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    let capturedDescriptors = [];
    const instructionDiv = document.createElement("div");
    instructionDiv.classList.add("instruction");
    instructionDiv.id = "instructionDiv";
    container.appendChild(instructionDiv);

    const interval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const brightness = estimateVideoBrightness(video);
      if (brightness < 40) {
        instructionDiv.textContent =
          "💡 Low lighting detected. Please move to a brighter area.";
        return;
      }

      faceapi.draw.drawDetections(canvas, resizedDetections);

      if (detections.length === 0) {
        instructionDiv.textContent =
          "🕵️‍♂️ No face detected. Please look at the camera.";
      } else if (detections.length > 1) {
        instructionDiv.textContent =
          "👥 Multiple faces found. Ensure only one person is in front of the camera.";
      } else {
        const box = detections[0].detection.box;
        if (box.width < 100 || box.height < 100) {
          instructionDiv.textContent =
            "📏 Move closer to the camera for better detection.";
          return;
        }

        capturedDescriptors.push(detections[0].descriptor);
        instructionDiv.textContent = `✅ Capturing... (${capturedDescriptors.length}/30 samples)`;

        if (capturedDescriptors.length >= 30) {
          clearInterval(interval);
          const canvas = document.getElementById("captureCanvas");
          const instruction = document.getElementById("instructionDiv");
          if (canvas) canvas.remove();
          if (instruction) instruction.remove();
          await saveCapturedFace(capturedDescriptors);
          stopCamera();
          setIsCapturing(false);
        }
      }
    }, 500);
  };

  function estimateVideoBrightness(video) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let total = 0;

    for (let i = 0; i < frame.data.length; i += 4) {
      const r = frame.data[i];
      const g = frame.data[i + 1];
      const b = frame.data[i + 2];
      total += (r + g + b) / 3;
    }

    return total / (frame.data.length / 4);
  }
const saveCapturedFace = async (capturedDescriptors) => {
  const faceData = {
    employee_id: userName,
    label: userName,
    descriptors: capturedDescriptors,
  };

  console.log("Face data to be saved:", JSON.stringify(faceData, null, 2));

  const API_KEY = process.env.REACT_APP_API_KEY;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

  console.log("API_KEY:", API_KEY);
  console.log("BACKEND_URL:", BACKEND_URL);
  console.log("Employee ID:", meId);

  if (!API_KEY || !BACKEND_URL) {
    showAlert("API Key or Backend URL is missing.");
    return;
  }

  if (!meId) {
    showAlert("Employee ID is missing from dashboard data.");
    return;
  }

  const headers = {
    "x-api-key": API_KEY,
    "x-employee-id": meId,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/face/save-face-data`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(faceData),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:", [...response.headers.entries()]);
    const data = await response.json();
    console.log("Response body:", data);

    if (response.ok) {
      showAlert(`${data.message}`);
      setTimeout(() => {
        closeAlert();
        onClose?.();
      }, 2000);
    } else {
      showAlert(`Error: ${data.error || "Unknown error occurred"}`);
    }
  } catch (error) {
    console.error("Error saving face data:", error);
    showAlert(`Failed to save face data: ${error.message || "Network error"}`);
  }
};
  const handleRecognition = () => {
    setIsRecognizing((prev) => !prev);
    if (!isRecognizing) {
      showAlert("Recognition will be implemented after saving works.");
    }
  };

  return (
    <div className="save-face-container">
      <h2>Save Face Data</h2>
      <div className="disclaimer-note">
        <p>
          <strong>Note:</strong> We are capturing your facial data for
          attendance purposes. This data will be securely stored and used solely
          for employee attendance tracking.
        </p>
      </div>
      {/* <p>Employee ID: <strong>{userName}</strong></p> */}
      <div className={`video-container ${isCapturing ? "capturing" : ""}`}>
        <video
          id="video"
          autoPlay
          muted
          playsInline
          width="640"
          height="480"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: isMobile ? "300px" : "360px",
            borderRadius: "10px",
            objectFit: "cover",
            boxShadow: "0 0 12px rgba(0, 0, 0, 0.3)",
          }}
        ></video>
      </div>
      <div className="face-buttons">
        {!isCapturing && (
          <button
            id="saveFace"
            onClick={captureFaceData}
            disabled={isCapturing || isRecognizing}
            className="btn"
          >
            Save My Face
          </button>
        )}
      </div>
      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
}

export default SaveFaceData;
