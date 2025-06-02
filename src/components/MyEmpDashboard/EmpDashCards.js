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
const [employeeId, setEmployeeId] = useState(null);
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
const data = localStorage.getItem("dashboardData");
if (data) {
try {
const parsed = JSON.parse(data);
setEmployeeId(parsed.employeeId);
} catch (e) {
console.error("Failed to parse dashboardData", e);
}
}
}, []);

useEffect(() => {
if (employeeId) {
fetchPunchData();
const interval = setInterval(fetchPunchData, 10000);
return () => clearInterval(interval);
}
}, [employeeId]);

useEffect(() => {
const loadModels = async () => {
const MODEL_URL = `${process.env.PUBLIC_URL}/models`;
await Promise.all([
faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
]);
};
loadModels();
}, []);

const fetchPunchData = async () => {
try {
const headers = { "x-api-key": API_KEY, "x-employee-id": employeeId };
const url = `${process.env.REACT_APP_BACKEND_URL}/attendance/employee/${employeeId}/latest-punch`;

const response = await axios.get(url, { headers });
const latestPunch = response.data?.data;

if (latestPunch) {
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

const getDeviceType = () =>
/Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";

const getLocationAndDevice = () => {
return new Promise((resolve) => {
if (!navigator.geolocation) {
return resolve({
location: "Geolocation not supported",
device: getDeviceType(),
});
}

navigator.geolocation.getCurrentPosition(
async (position) => {
const { latitude, longitude } = position.coords;
const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

try {
const res = await fetch(
`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18`
);
const data = await res.json();

const { road, suburb, town, city, county, state, postcode } =
data?.address || {};
const location = [road, suburb, town, city, county, state, postcode]
.filter(Boolean)
.join(", ");

resolve({
location: location || "Unknown",
device: getDeviceType(),
latitude,
longitude,
googleMapsLink,
});
} catch (err) {
console.error("Reverse geocoding failed", err);
resolve({
location: "Unknown",
device: getDeviceType(),
latitude,
longitude,
googleMapsLink,
});
}
},
(error) => {
console.error("Geolocation error:", error);
resolve({
location: "Unable to retrieve location",
device: getDeviceType(),
});
},
{ enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
);
});
};

const isCameraAvailable = async () => {
try {
const devices = await navigator.mediaDevices.enumerateDevices();
return devices.some((d) => d.kind === "videoinput");
} catch (err) {
console.error("Camera check failed", err);
return false;
}
};

const verifyFace = async () => {
try {
setShowCamera(true);
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
videoRef.current.srcObject = stream;

await new Promise((res) => setTimeout(res, 2000));

let detection = null;
for (let i = 0; i < 10 && !detection; i++) {
detection = await faceapi
.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
.withFaceLandmarks()
.withFaceDescriptor();
if (!detection) await new Promise((r) => setTimeout(r, 1000));
}

if (!detection) return { success: false, error: "Face not detected" };

const { data } = await axios.get(
`${process.env.REACT_APP_BACKEND_URL}/api/face-data/${employeeId}`,
{ headers: { "x-api-key": API_KEY, "x-employee-id": employeeId } }
);

for (const desc of data.descriptors || []) {
const parsed =
typeof desc === "string" ? JSON.parse(desc) : Array.isArray(desc) ? desc : Object.values(desc);
const distance = faceapi.euclideanDistance(
detection.descriptor,
new Float32Array(parsed)
);
if (distance < 0.4) return { success: true };
}

return { success: false, error: "Face not matched" };
} catch (e) {
return { success: false, error: e.message };
} finally {
const stream = videoRef.current?.srcObject;
if (stream) stream.getTracks().forEach((track) => track.stop());
setShowCamera(false);
}
};

const handlePunch = async () => {
setErrorMessage("");
if (!employeeId || !API_KEY) {
setErrorMessage("Session expired. Please login again.");
return;
}

setLoading(true);

const hasCamera = await isCameraAvailable();
let faceResult = { success: true };

if (hasCamera) faceResult = await verifyFace();

if (!faceResult.success) {
setLoading(false);
setErrorMessage(faceResult.error || "Face verification failed");
return;
}

const { location, device } = await getLocationAndDevice();

if (!location || !device) {
setErrorMessage("Could not retrieve device/location information.");
setLoading(false);
return;
}

try {
const url = isPunchedIn
? `${process.env.REACT_APP_BACKEND_URL}/attendance/punch-out`
: `${process.env.REACT_APP_BACKEND_URL}/attendance/punch-in`;

const response = await fetch(url, {
method: "POST",
headers: {
"Content-Type": "application/json",
"x-api-key": API_KEY,
"x-employee-id": employeeId,
},
body: JSON.stringify({
employeeId,
device,
location,
punchMode: "Manual",
}),
});

const result = await response.json();

if (!response.ok) {
throw new Error(result.message || "Punch failed");
}

setIsPunchedIn(!isPunchedIn);
fetchPunchData();
} catch (err) {
setErrorMessage(err.message || "Something went wrong.");
} finally {
setLoading(false);
}
};

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
className={`emp-card emp-punch-in ${isPunchedIn ? "emp-punched-out" : ""}`}
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

