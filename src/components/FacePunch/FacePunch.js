

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./FacePunch.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_KEY = process.env.REACT_APP_API_KEY;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const COOLDOWN_PERIOD = 10000; // 10 seconds cooldown (adjustable)
const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

const FacePunch = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPunchTime, setLastPunchTime] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [lastPunchStatus, setLastPunchStatus] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        startVideo();
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsVideoReady(true);
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
          toast.error("Unable to access webcam. Please check permissions.", {
            autoClose: 2000,
          });
        });
    };

    loadModels();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    let intervalId;

    const detectFace = async () => {
      const currentTime = Date.now();

      if (isProcessing) return;

      if (currentTime - lastPunchTime < COOLDOWN_PERIOD) {
        const remaining = Math.ceil(
          (COOLDOWN_PERIOD - (currentTime - lastPunchTime)) / 1000
        );
        setCooldownRemaining(remaining);
        return;
      }

      if (!videoRef.current) return;

      try {
        setIsProcessing(true);

        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (canvasRef.current && videoRef.current) {
          const canvas = canvasRef.current;
          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
        }

        if (detections.length > 0) {
          console.log("Face detected, initiating punch...");
          await captureAndPunch(detections[0]);
          setLastPunchTime(Date.now());
          setCooldownRemaining(COOLDOWN_PERIOD / 1000);
        }
      } catch (err) {
        console.error("Detection error:", err);
      } finally {
        setIsProcessing(false);
      }
    };

    if (isVideoReady) {
      intervalId = setInterval(detectFace, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isVideoReady, isProcessing, lastPunchTime]);

  const getLastPunchStatus = async (descriptorArray) => {
    try {
      console.log("Fetching last punch status with descriptor:", descriptorArray);
      const response = await axios.post(
        `${BACKEND_URL}/last-punch-status`,
        { descriptor: descriptorArray },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );
      console.log("Last punch status response:", response.data);
      return response.data.status || null;
    } catch (error) {
      console.error(
        "Error fetching last punch status:",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  const speakPunchStatus = (name, status) => {
    console.log("speakPunchStatus called with:", { name, status });
    const announcement = `${name} ${status}`;
    const utterance = new SpeechSynthesisUtterance(announcement);
    utterance.lang = "en-US";
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    console.log("Announcing:", announcement);
    window.speechSynthesis.speak(utterance);
  };

  const captureAndPunch = async (detection) => {
    const descriptorArray = Array.from(detection.descriptor);
    try {
      const lastStatus = await getLastPunchStatus(descriptorArray);
      console.log("Determined lastStatus:", lastStatus);
      const punchType = lastStatus === "punch-in" ? "punch-out" : "punch-in";
      console.log("Calculated punchType:", punchType);

      console.log(`Sending ${punchType} request to backend`);
      const response = await axios.post(
        `${BACKEND_URL}/face-punch`,
        {
          descriptor: descriptorArray,
          punchType,
          punchmode: "Manually",
          device: "Desktop",
          location: "Office HQ",
        },
        {
          headers,
        }
      );

      console.log("Full punch response:", response.data);

      // Extract status from response.data.message
      const message = response.data.message ? response.data.message.toLowerCase() : "";
      let announcementStatus;
      if (message.includes("punch out") || message.includes("punched out") || message.includes("punch-out")) {
        announcementStatus = "punched out";
      } else if (message.includes("punch in") || message.includes("punched in") || message.includes("punch-in")) {
        announcementStatus = "punched in";
      } else {
        announcementStatus = punchType === "punch-in" ? "punched in" : "punched out";
      }
      console.log("Extracted announcementStatus from message:", announcementStatus);

      // Update lastPunchStatus with confirmed punchType from backend or calculated
      const confirmedPunchType = response.data.punchType || punchType;
      console.log("Confirmed punchType:", confirmedPunchType);
      setLastPunchStatus(confirmedPunchType);

      // Store employee info and announce
      if (response.data.employee_id) {
        const employeeData = {
          id: response.data.employee_id,
          name: response.data.employee_name || "Employee",
        };
        setEmployeeInfo(employeeData);

        // Announce using extracted status
        speakPunchStatus(employeeData.name, announcementStatus);
      } else {
        console.warn("No employee_id in response, skipping announcement");
      }

      toast.success(`${response.data.message} (${response.data.employee_id})`, {
        autoClose: 2000,
      });
    } catch (error) {
      console.error(
        "Error sending punch:",
        error.response ? error.response.data : error.message
      );

      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Face not recognized"
      ) {
        toast.warn("Face not recognized. Please try again.", { autoClose: 2000 });
      } else {
        toast.error("Something went wrong while punching.", { autoClose: 2000 });
      }
    }
  };

  return (
    <>
      <div className="face-punch-container">
        <video
          ref={videoRef}
          id="videoInput"
          autoPlay
          muted
          width="720"
          height="560"
        />
        <canvas ref={canvasRef} className="overlay-canvas" />
      </div>

      {employeeInfo ? (
        <div className="employee-info-message">
          Detected: {employeeInfo.name} ({employeeInfo.id})
        </div>
      ) : (
        <div className="employee-info-message">No employee info detected yet.</div>
      )}

      {(isProcessing || cooldownRemaining > 0) && (
        <div className="cooldown-message">
          {isProcessing
            ? "Processing punch, please wait..."
            : `Please wait ${cooldownRemaining} seconds for the next punch...`}
        </div>
      )}

      <ToastContainer position="top-center" style={{ marginTop: "40px" }} />
    </>
  );
};

export default FacePunch;