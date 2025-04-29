// import React, { useState, useEffect } from 'react';
// import * as faceapi from 'face-api.js';

// import './SaveFaceData.css';

// function SaveFaceData() {
//   const [userName, setUserName] = useState('');
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [isRecognizing, setIsRecognizing] = useState(false);
//   const [faceMatcher, setFaceMatcher] = useState(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//         await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//         await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
//         setModelsLoaded(true);
//         startCamera();
//       } catch (error) {
//         console.error('Error loading models:', error);
//         alert('Error initializing face recognition models.');
//       }
//     };
//     loadModels();
//   }, []);

//   const startCamera = () => {
//     const video = document.getElementById('video');
//     navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
//       video.srcObject = stream;
//     }).catch((error) => {
//       console.error('Camera error:', error);
//       alert('Could not access camera');
//     });
//   };

//   const captureFaceData = async () => {
//     if (!modelsLoaded) {
//       alert('Models not loaded yet.');
//       return;
//     }
//     if (!userName.trim()) {
//       alert('Please enter your Employee ID');
//       return;
//     }

//     setIsCapturing(true);

//     const video = document.getElementById('video');
//     const canvas = faceapi.createCanvasFromMedia(video);
//     canvas.id = 'captureCanvas';
//     document.body.appendChild(canvas);

//     const displaySize = { width: video.width, height: video.height };
//     faceapi.matchDimensions(canvas, displaySize);

//     let capturedDescriptors = [];
//     const instructionDiv = document.createElement('div');
//     instructionDiv.classList.add('instruction');
//     instructionDiv.id = 'instructionDiv';
//     document.body.appendChild(instructionDiv);

//     const interval = setInterval(async () => {
//       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();

//       const resizedDetections = faceapi.resizeResults(detections, displaySize);
//       const ctx = canvas.getContext('2d');
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       if (detections.length === 1) {
//         capturedDescriptors.push(detections[0].descriptor);
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         instructionDiv.textContent = `Capturing... (${capturedDescriptors.length}/5 samples)`;

//         if (capturedDescriptors.length >= 5) {
//           clearInterval(interval);
//           document.getElementById('captureCanvas')?.remove();
//           document.getElementById('instructionDiv')?.remove();
//           await saveCapturedFace(capturedDescriptors);
//           setIsCapturing(false);
//         }
//       } else {
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         instructionDiv.textContent = 'Ensure only one face is visible';
//       }
//     }, 500);
//   };

//   const saveCapturedFace = async (capturedDescriptors) => {
//     const faceData = {
//       employee_id: userName,
//       label: userName,
//       descriptors: capturedDescriptors,
//     };
  
//     // Get the API key from the environment variable
//     const API_KEY = process.env.REACT_APP_API_KEY;
  
//     if (!API_KEY) {
//       alert('API Key is missing.');
//       return;
//     }
  
//     try {
//       const response = await fetch('http://localhost:5000/api/face/save-face-data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': API_KEY, // Add the API key to the request headers
//         },
//         body: JSON.stringify(faceData),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         alert(`${data.message}`);
//       } else {
//         alert(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error saving face data:', error);
//       alert('Failed to save face data');
//     }
//   };
  
//   // Recognition logic placeholder (will use later)
//   const handleRecognition = () => {
//     setIsRecognizing((prev) => !prev);
//     if (!isRecognizing) {
//       alert('Recognition will be implemented after saving works.');
//     }
//   };

//   return (
//     <div className="save-face-container">
//       <h2>Save Face Data</h2>
//       <input
//         type="text"
//         id="userName"
//         value={userName}
//         onChange={(e) => setUserName(e.target.value)}
//         placeholder="Enter your Employee ID"
//         className="name-input"
//       />
//       <div className="video-container">
//         <video id="video" width="640" height="480" autoPlay muted></video>
//       </div>
//       <div className="face-buttons">
//         <button
//           id="saveFace"
//           onClick={captureFaceData}
//           disabled={isCapturing}
//           className="btn"
//         >
//           {isCapturing ? 'Capturing...' : 'Save My Face'}
//         </button>
//         <button
//           id="startRecognition"
//           onClick={handleRecognition}
//           className="btn"
//         >
//           {isRecognizing ? 'Stop Recognition' : 'Start Recognition'}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default SaveFaceData;


// import React, { useState, useEffect } from 'react';
// import * as faceapi from 'face-api.js';

// import './SaveFaceData.css';

// function SaveFaceData() {
//   const [userName, setUserName] = useState('');
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [isRecognizing, setIsRecognizing] = useState(false);
//   const [faceMatcher, setFaceMatcher] = useState(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);

 
//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//         await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//         await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
//         setModelsLoaded(true);
//       } catch (error) {
//         console.error('Error loading models:', error);
//         alert('Error initializing face recognition models.');
//       }
//     };
//     loadModels();
//   }, []);
  
//   const startCamera = () => {
//     const video = document.getElementById('video');
//     return new Promise((resolve, reject) => {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then((stream) => {
//           video.srcObject = stream;
//           video.onloadedmetadata = () => {
//             video.play();
//             resolve();
//           };
//         })
//         .catch((error) => {
//           console.error('Camera error:', error);
//           alert('Could not access camera');
//           reject(error);
//         });
//     });
//   };
  

//   const stopCamera = () => {
//     const video = document.getElementById('video');
//     const stream = video.srcObject;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       video.srcObject = null;
//     }
//   };
  

//   // const captureFaceData = async () => {
//   //   if (!modelsLoaded) {
//   //     alert('Models not loaded yet.');
//   //     return;
//   //   }
//   //   if (!userName.trim()) {
//   //     alert('Please enter your Employee ID');
//   //     return;
//   //   }
  
//   //   setIsCapturing(true);
    
//   //   // Start camera
//   //   await startCamera();
  
//   //   const video = document.getElementById('video');
//   //   const canvas = faceapi.createCanvasFromMedia(video);
//   //   canvas.id = 'captureCanvas';
//   //   document.body.appendChild(canvas);
  
//   //   const displaySize = { width: video.width, height: video.height };
//   //   faceapi.matchDimensions(canvas, displaySize);
  
//   //   let capturedDescriptors = [];
//   //   const instructionDiv = document.createElement('div');
//   //   instructionDiv.classList.add('instruction');
//   //   instructionDiv.id = 'instructionDiv';
//   //   document.body.appendChild(instructionDiv);
  
//   //   const interval = setInterval(async () => {
//   //     const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//   //       .withFaceLandmarks()
//   //       .withFaceDescriptors();
  
//   //     const resizedDetections = faceapi.resizeResults(detections, displaySize);
//   //     const ctx = canvas.getContext('2d');
//   //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//   //     if (detections.length === 1) {
//   //       capturedDescriptors.push(detections[0].descriptor);
//   //       faceapi.draw.drawDetections(canvas, resizedDetections);
//   //       instructionDiv.textContent = `Capturing... (${capturedDescriptors.length}/5 samples)`;
  
//   //       if (capturedDescriptors.length >= 5) {
//   //         clearInterval(interval);
//   //         document.getElementById('captureCanvas')?.remove();
//   //         document.getElementById('instructionDiv')?.remove();
//   //         await saveCapturedFace(capturedDescriptors);
//   //         stopCamera();
//   //         setIsCapturing(false);
//   //       }
//   //     } else {
//   //       faceapi.draw.drawDetections(canvas, resizedDetections);
//   //       instructionDiv.textContent = 'Ensure only one face is visible';
//   //     }
//   //   }, 500);
//   // };
//   const captureFaceData = async () => {
//     if (!modelsLoaded) {
//       alert('Models not loaded yet.');
//       return;
//     }
  
//     if (!userName.trim()) {
//       alert('Please enter your Employee ID');
//       return;
//     }
  
//     // 🔍 Check if face data already exists
//     try {
//       const checkResponse = await fetch(`http://localhost:5000/api/face/check/${userName}`);
//       const checkData = await checkResponse.json();
  
//       // Log the response for debugging
//       console.log('Check response:', checkData);
  
//       if (checkData.exists) {
//         alert('Face data already exists for this Employee ID.');
//         return;  // Early return to prevent capture
//       }
//     } catch (error) {
//       console.error('Error checking existing face data:', error);
//       alert('Failed to check existing face data. Please try again.');
//       return;
//     }
  
//     setIsCapturing(true);
  
//     // Start camera
//     await startCamera();
  
//     const video = document.getElementById('video');
//     const canvas = faceapi.createCanvasFromMedia(video);
//     canvas.id = 'captureCanvas';
//     document.body.appendChild(canvas);
  
//     const displaySize = { width: video.width, height: video.height };
//     faceapi.matchDimensions(canvas, displaySize);
  
//     let capturedDescriptors = [];
//     const instructionDiv = document.createElement('div');
//     instructionDiv.classList.add('instruction');
//     instructionDiv.id = 'instructionDiv';
//     document.body.appendChild(instructionDiv);
  
//     const interval = setInterval(async () => {
//       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();
  
//       const resizedDetections = faceapi.resizeResults(detections, displaySize);
//       const ctx = canvas.getContext('2d');
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//       if (detections.length === 1) {
//         capturedDescriptors.push(detections[0].descriptor);
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         instructionDiv.textContent = `Capturing... (${capturedDescriptors.length}/5 samples)`;
  
//         if (capturedDescriptors.length >= 5) {
//           clearInterval(interval);
//           document.getElementById('captureCanvas')?.remove();
//           document.getElementById('instructionDiv')?.remove();
//           await saveCapturedFace(capturedDescriptors);
//           stopCamera();
//           setIsCapturing(false);
//         }
//       } else {
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         instructionDiv.textContent = 'Ensure only one face is visible';
//       }
//     }, 500);
//   };
  
  
//   const saveCapturedFace = async (capturedDescriptors) => {
//     const faceData = {
//       employee_id: userName,
//       label: userName,
//       descriptors: capturedDescriptors,
//     };
  
//     // Get the API key from the environment variable
//     const API_KEY = process.env.REACT_APP_API_KEY;
  
//     if (!API_KEY) {
//       alert('API Key is missing.');
//       return;
//     }
  
//     try {
//       const response = await fetch('http://localhost:5000/api/face/save-face-data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': API_KEY, // Add the API key to the request headers
//         },
//         body: JSON.stringify(faceData),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         alert(`${data.message}`);
//       } else {
//         alert(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error saving face data:', error);
//       alert('Failed to save face data');
//     }
//   };
  
//   // Recognition logic placeholder (will use later)
//   const handleRecognition = () => {
//     setIsRecognizing((prev) => !prev);
//     if (!isRecognizing) {
//       alert('Recognition will be implemented after saving works.');
//     }
//   };

//   return (
//     <div className="save-face-container">
//       <h2>Save Face Data</h2>
//       <input
//         type="text"
//         id="userName"
//         value={userName}
//         onChange={(e) => setUserName(e.target.value)}
//         placeholder="Enter your Employee ID"
//         className="name-input"
//       />
//       <div className="video-container">
//         <video id="video" width="640" height="480" autoPlay muted></video>
//       </div>
//       <div className="face-buttons">
//         <button
//           id="saveFace"
//           onClick={captureFaceData}
//           disabled={isCapturing}
//           className="btn"
//         >
//           {isCapturing ? 'Capturing...' : 'Save My Face'}
//         </button>
//         <button
//           id="startRecognition"
//           onClick={handleRecognition}
//           className="btn"
//         >
//           {isRecognizing ? 'Stop Recognition' : 'Start Recognition'}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default SaveFaceData;


// // import React, { useState, useEffect } from 'react';
// // import * as faceapi from 'face-api.js';
// // import './SaveFaceData.css';

// // function SaveFaceData() {
// //   const [userName, setUserName] = useState('');
// //   const [isCapturing, setIsCapturing] = useState(false);
// //   const [isRecognizing, setIsRecognizing] = useState(false);
// //   const [faceMatcher, setFaceMatcher] = useState(null);
// //   const [modelsLoaded, setModelsLoaded] = useState(false);

// //   useEffect(() => {
// //     const loadModels = async () => {
// //       try {
// //         await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
// //         await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
// //         await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
// //         setModelsLoaded(true);
// //       } catch (error) {
// //         console.error('Error loading models:', error);
// //         alert('Error initializing face recognition models.');
// //       }
// //     };
// //     loadModels();
// //   }, []);

// //   const startCamera = () => {
// //     const video = document.getElementById('video');
// //     return new Promise((resolve, reject) => {
// //       navigator.mediaDevices.getUserMedia({ video: true })
// //         .then((stream) => {
// //           video.srcObject = stream;
// //           video.onloadedmetadata = () => {
// //             video.play();
// //             resolve();
// //           };
// //         })
// //         .catch((error) => {
// //           console.error('Camera error:', error);
// //           alert('Could not access camera');
// //           reject(error);
// //         });
// //     });
// //   };

// //   const stopCamera = () => {
// //     const video = document.getElementById('video');
// //     const stream = video.srcObject;
// //     if (stream) {
// //       stream.getTracks().forEach((track) => track.stop());
// //       video.srcObject = null;
// //     }
// //   };

// //   const captureFaceData = async () => {
// //     if (!modelsLoaded) {
// //       alert('Models not loaded yet.');
// //       return;
// //     }
  
// //     if (!userName.trim()) {
// //       alert('Please enter your Employee ID');
// //       return;
// //     }
  
// //     // 🔍 Check if face data already exists
// //     try {
// //       const checkResponse = await fetch(`http://localhost:5000/api/face/check/${userName}`);
// //       const checkData = await checkResponse.json();
// //       console.log('Check response:', checkData);  // Debug log
  
// //       if (checkData.exists) {
// //         alert('Face data already exists for this Employee ID.');
// //         return;  // Early return to prevent capture
// //       }
// //     } catch (error) {
// //       console.error('Error checking existing face data:', error);
// //       alert('Failed to check existing face data. Please try again.');
// //       return;
// //     }
  
// //     setIsCapturing(true);
  
// //     // Start camera
// //     await startCamera();
  
// //     const video = document.getElementById('video');
// //     const canvas = faceapi.createCanvasFromMedia(video);
// //     canvas.id = 'captureCanvas';
// //     document.body.appendChild(canvas);
  
// //     const displaySize = { width: video.width, height: video.height };
// //     faceapi.matchDimensions(canvas, displaySize);
  
// //     let capturedDescriptors = [];
// //     const instructionDiv = document.createElement('div');
// //     instructionDiv.classList.add('instruction');
// //     instructionDiv.id = 'instructionDiv';
// //     document.body.appendChild(instructionDiv);
  
// //     const interval = setInterval(async () => {
// //       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
// //         .withFaceLandmarks()
// //         .withFaceDescriptors();
  
// //       const resizedDetections = faceapi.resizeResults(detections, displaySize);
// //       const ctx = canvas.getContext('2d');
// //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  
// //       if (detections.length === 1) {
// //         capturedDescriptors.push(detections[0].descriptor);
// //         faceapi.draw.drawDetections(canvas, resizedDetections);
// //         instructionDiv.textContent = `Capturing... (${capturedDescriptors.length}/5 samples)`;
  
// //         // Log the captured descriptors for debugging
// //         console.log('Captured descriptors:', capturedDescriptors);
  
// //         if (capturedDescriptors.length >= 5) {
// //           clearInterval(interval);
// //           document.getElementById('captureCanvas')?.remove();
// //           document.getElementById('instructionDiv')?.remove();
// //           await saveCapturedFace(capturedDescriptors);
// //           stopCamera();
// //           setIsCapturing(false);
// //         }
// //       } else {
// //         faceapi.draw.drawDetections(canvas, resizedDetections);
// //         instructionDiv.textContent = 'Ensure only one face is visible';
// //       }
// //     }, 500);
// //   };
  
// //   const saveCapturedFace = async (capturedDescriptors) => {
// //     const faceData = {
// //       employee_id: userName,
// //       label: userName,
// //       descriptors: capturedDescriptors,
// //     };
  
// //     console.log('Face data to be saved:', faceData);  // Debug log
  
// //     // Get the API key from the environment variable
// //     const API_KEY = process.env.REACT_APP_API_KEY;
  
// //     if (!API_KEY) {
// //       alert('API Key is missing.');
// //       return;
// //     }
  
// //     try {
// //       const response = await fetch('http://localhost:5000/api/face/save-face-data', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'x-api-key': API_KEY, // Add the API key to the request headers
// //         },
// //         body: JSON.stringify(faceData),
// //       });
  
// //       const data = await response.json();
// //       console.log('Response from server:', data);  // Debug log
// //       if (response.ok) {
// //         alert(`${data.message}`);
// //       } else {
// //         alert(`Error: ${data.error}`);
// //       }
// //     } catch (error) {
// //       console.error('Error saving face data:', error);
// //       alert('Failed to save face data');
// //     }
// //   };
// //     const handleRecognition = () => {
// //     setIsRecognizing((prev) => !prev);
// //     if (!isRecognizing) {
// //       alert('Recognition will be implemented after saving works.');
// //     }
// //   };

// //   return (
// //     <div className="save-face-container">
// //       <h2>Save Face Data</h2>
// //       <input
// //         type="text"
// //         id="userName"
// //         value={userName}
// //         onChange={(e) => setUserName(e.target.value)}
// //         placeholder="Enter your Employee ID"
// //         className="name-input"
// //       />
// //       <div className="video-container">
// //         <video id="video" width="640" height="480" autoPlay muted></video>
// //       </div>
// //       <div className="face-buttons">
// //         <button
// //           id="saveFace"
// //           onClick={captureFaceData}
// //           disabled={isCapturing}
// //           className="btn"
// //         >
// //           {isCapturing ? 'Capturing...' : 'Save My Face'}
// //         </button>
// //         <button
// //           id="startRecognition"
// //           onClick={handleRecognition}
// //           className="btn"
// //         >
// //           {isRecognizing ? 'Stop Recognition' : 'Start Recognition'}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default SaveFaceData;

// import React, { useState, useEffect } from 'react';
// import * as faceapi from 'face-api.js';
// import './SaveFaceData.css';

// function SaveFaceData() {
//   const [userName, setUserName] = useState('');
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [isRecognizing, setIsRecognizing] = useState(false);
//   const [modelsLoaded, setModelsLoaded] = useState(false);

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//         await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//         await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
//         setModelsLoaded(true);
//       } catch (error) {
//         console.error('Error loading models:', error);
//         alert('Error initializing face recognition models.');
//       }
//     };
//     loadModels();
//   }, []);

//   const startCamera = () => {
//     const video = document.getElementById('video');
//     return new Promise((resolve, reject) => {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then((stream) => {
//           video.srcObject = stream;
//           video.onloadedmetadata = () => {
//             video.play();
//             resolve();
//           };
//         })
//         .catch((error) => {
//           console.error('Camera error:', error);
//           alert('Could not access camera');
//           reject(error);
//         });
//     });
//   };

//   const stopCamera = () => {
//     const video = document.getElementById('video');
//     const stream = video.srcObject;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       video.srcObject = null;
//     }
//   };

//   const captureFaceData = async () => {
//     if (!modelsLoaded) {
//       alert('Models not loaded yet.');
//       return;
//     }
  
//     if (!userName.trim()) {
//       alert('Please enter your Employee ID');
//       return;
//     }
  
//     // Check if face data already exists for this Employee ID
//     try {
//       const API_KEY = process.env.REACT_APP_API_KEY;

//       const checkResponse = await fetch(`http://localhost:5000/api/face/check/${userName}`, {
//         headers: {
//           'x-api-key': API_KEY,
//         },
//       });      const checkData = await checkResponse.json();
//       console.log('Check response:', checkData);  // Debug log
  
//       if (checkData.exists) {
//         alert('Face data already exists for this Employee ID.');
//         return;  // Early return to prevent capture
//       }
  
//       // Check for multiple entries for the same Employee ID
//       if (checkData.count > 1) {
//         alert(`Multiple entries found for Employee ID ${userName}. Cannot capture face data.`);
//         return;  // Prevent capturing if multiple records exist for the same Employee ID
//       }
//     } catch (error) {
//       console.error('Error checking existing face data:', error);
//       alert('Failed to check existing face data. Please try again.');
//       return;
//     }
  
//     setIsCapturing(true);
  
//     // Start camera
//     await startCamera();
  
//     const video = document.getElementById('video');
//     const canvas = faceapi.createCanvasFromMedia(video);
//     canvas.id = 'captureCanvas';
//     document.body.appendChild(canvas);
  
//     const displaySize = { width: video.width, height: video.height };
//     faceapi.matchDimensions(canvas, displaySize);
  
//     let capturedDescriptors = [];
//     const instructionDiv = document.createElement('div');
//     instructionDiv.classList.add('instruction');
//     instructionDiv.id = 'instructionDiv';
//     document.body.appendChild(instructionDiv);
  
//     const interval = setInterval(async () => {
//       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();
  
//       const resizedDetections = faceapi.resizeResults(detections, displaySize);
//       const ctx = canvas.getContext('2d');
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//       if (detections.length === 1) {
//         capturedDescriptors.push(detections[0].descriptor);
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         instructionDiv.textContent = `Capturing... (${capturedDescriptors.length}/5 samples)`;
  
//         // Log the captured descriptors for debugging
//         console.log('Captured descriptors:', capturedDescriptors);
  
//         if (capturedDescriptors.length >= 5) {
//           clearInterval(interval);
//           document.getElementById('captureCanvas')?.remove();
//           document.getElementById('instructionDiv')?.remove();
//           await saveCapturedFace(capturedDescriptors);
//           stopCamera();
//           setIsCapturing(false);
//         }
//       } else {
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         instructionDiv.textContent = 'Ensure only one face is visible';
//       }
//     }, 500);
//   };
  

//   const saveCapturedFace = async (capturedDescriptors) => {
//     const faceData = {
//       employee_id: userName,
//       label: userName,
//       descriptors: capturedDescriptors,
//     };

//     console.log('Face data to be saved:', faceData);  // Debug log

//     // Get the API key from the environment variable
//     const API_KEY = process.env.REACT_APP_API_KEY;

//     if (!API_KEY) {
//       alert('API Key is missing.');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/face/save-face-data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': API_KEY, // Add the API key to the request headers
//         },
//         body: JSON.stringify(faceData),
//       });

//       const data = await response.json();
//       console.log('Response from server:', data);  // Debug log
//       if (response.ok) {
//         alert(`${data.message}`);
//       } else {
//         alert(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error saving face data:', error);
//       alert('Failed to save face data');
//     }
//   };

//   const handleRecognition = () => {
//     setIsRecognizing((prev) => !prev);
//     if (!isRecognizing) {
//       alert('Recognition will be implemented after saving works.');
//     }
//   };

//   return (
//     <div className="save-face-container">
//       <h2>Save Face Data</h2>
//       <input
//         type="text"
//         id="userName"
//         value={userName}
//         onChange={(e) => setUserName(e.target.value)}
//         placeholder="Enter your Employee ID"
//         className="name-input"
//       />
//       <div className="video-container">
//         <video id="video" width="640" height="480" autoPlay muted></video>
//       </div>
//       <div className="face-buttons">
//         <button
//           id="saveFace"
//           onClick={captureFaceData}
//           disabled={isCapturing || isRecognizing}
//           className="btn"
//         >
//           {isCapturing ? 'Capturing...' : 'Save My Face'}
//         </button>
//         {/* <button
//           id="startRecognition"
//           onClick={handleRecognition}
//           className="btn"
//         >
//           {isRecognizing ? 'Stop Recognition' : 'Start Recognition'}
//         </button> */}
//       </div>
//     </div>
//   );
// }

// export default SaveFaceData;





// import React, { useState, useEffect } from 'react';
// import * as faceapi from 'face-api.js';
// import './SaveFaceData.css';

// function SaveFaceData() {
//   const [userName, setUserName] = useState('');
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [isRecognizing, setIsRecognizing] = useState(false);
//   const [modelsLoaded, setModelsLoaded] = useState(false);

//   useEffect(() => {
//     // ✅ Fetch employee ID from dashboardData in localStorage
//     const dashboardData = localStorage.getItem('dashboardData');
//     if (dashboardData) {
//       try {
//         const parsedData = JSON.parse(dashboardData);
//         if (parsedData.employeeId) {
//           setUserName(parsedData.employeeId.toString());
//         } else {
//           alert("Employee ID not found in dashboard data.");
//         }
//       } catch (error) {
//         console.error("Error parsing dashboardData:", error);
//         alert("Invalid dashboard data in localStorage.");
//       }
//     } else {
//       alert("Dashboard data not found in localStorage.");
//     }

//     const loadModels = async () => {
//       try {
//         await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//         await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//         await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
//         setModelsLoaded(true);
//       } catch (error) {
//         console.error('Error loading models:', error);
//         alert('Error initializing face recognition models.');
//       }
//     };

//     loadModels();
//   }, []);

//   const startCamera = () => {
//     const video = document.getElementById('video');
//     return new Promise((resolve, reject) => {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then((stream) => {
//           video.srcObject = stream;
//           video.onloadedmetadata = () => {
//             video.play();
//             resolve();
//           };
//         })
//         .catch((error) => {
//           console.error('Camera error:', error);
//           alert('Could not access camera');
//           reject(error);
//         });
//     });
//   };

//   const stopCamera = () => {
//     const video = document.getElementById('video');
//     const stream = video.srcObject;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       video.srcObject = null;
//     }
//   };

//   const captureFaceData = async () => {
//     if (!modelsLoaded) {
//       alert('Models not loaded yet.');
//       return;
//     }

//     if (!userName.trim()) {
//       alert('Employee ID not found.');
//       return;
//     }

//     try {
//       const API_KEY = process.env.REACT_APP_API_KEY;

//       const checkResponse = await fetch(`http://localhost:5000/api/face/check/${userName}`, {
//         headers: {
//           'x-api-key': API_KEY,
//         },
//       });
//       const checkData = await checkResponse.json();
//       console.log('Check response:', checkData);

//       if (checkData.exists) {
//         alert('Face data already exists for this Employee ID.');
//         return;
//       }

//       if (checkData.count > 1) {
//         alert(`Multiple entries found for Employee ID ${userName}. Cannot capture face data.`);
//         return;
//       }
//     } catch (error) {
//       console.error('Error checking existing face data:', error);
//       alert('Failed to check existing face data. Please try again.');
//       return;
//     }

//     setIsCapturing(true);
//     await startCamera();

//     const video = document.getElementById('video');
//     const canvas = faceapi.createCanvasFromMedia(video);
//     canvas.id = 'captureCanvas';
//     document.body.appendChild(canvas);

//     const displaySize = { width: video.width, height: video.height };
//     faceapi.matchDimensions(canvas, displaySize);

//     let capturedDescriptors = [];
//     const instructionDiv = document.createElement('div');
//     instructionDiv.classList.add('instruction');
//     instructionDiv.id = 'instructionDiv';
//     document.body.appendChild(instructionDiv);

//     const interval = setInterval(async () => {
//       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();

//       const resizedDetections = faceapi.resizeResults(detections, displaySize);
//       const ctx = canvas.getContext('2d');
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       if (detections.length === 1) {
//         capturedDescriptors.push(detections[0].descriptor);
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         instructionDiv.textContent = `Capturing... (${capturedDescriptors.length}/5 samples)`;

//         if (capturedDescriptors.length >= 5) {
//           clearInterval(interval);
//           document.getElementById('captureCanvas')?.remove();
//           document.getElementById('instructionDiv')?.remove();
//           await saveCapturedFace(capturedDescriptors);
//           stopCamera();
//           setIsCapturing(false);
//         }
//       } else {
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         instructionDiv.textContent = 'Ensure only one face is visible';
//       }
//     }, 500);
//   };

//   const saveCapturedFace = async (capturedDescriptors) => {
//     const faceData = {
//       employee_id: userName,
//       label: userName,
//       descriptors: capturedDescriptors,
//     };

//     console.log('Face data to be saved:', faceData);

//     const API_KEY = process.env.REACT_APP_API_KEY;

//     if (!API_KEY) {
//       alert('API Key is missing.');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/face/save-face-data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': API_KEY,
//         },
//         body: JSON.stringify(faceData),
//       });

//       const data = await response.json();
//       console.log('Response from server:', data);
//       if (response.ok) {
//         alert(`${data.message}`);
//       } else {
//         alert(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error saving face data:', error);
//       alert('Failed to save face data');
//     }
//   };


  

//   const handleRecognition = () => {
//     setIsRecognizing((prev) => !prev);
//     if (!isRecognizing) {
//       alert('Recognition will be implemented after saving works.');
//     }
//   };

//   return (
//     <div className="save-face-container">
//       <h2>Save Face Data</h2>
//       <p>Employee ID: <strong>{userName}</strong></p>
//       <div className="video-container">
//         <video id="video" width="640" height="480" autoPlay muted></video>
//       </div>
//       <div className="face-buttons">
//         <button
//           id="saveFace"
//           onClick={captureFaceData}
//           disabled={isCapturing || isRecognizing}
//           className="btn"
//         >
//           {isCapturing ? 'Capturing...' : 'Save My Face'}
//         </button>
       
//       </div>
//     </div>
//   );
// }

// export default SaveFaceData;


// import React, { useState, useEffect } from 'react';
// import * as faceapi from 'face-api.js';
// import './SaveFaceData.css';

// function SaveFaceData({ onClose }) { // Added onClose prop
//   const [userName, setUserName] = useState('');
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [isRecognizing, setIsRecognizing] = useState(false);
//   const [modelsLoaded, setModelsLoaded] = useState(false);

//   useEffect(() => {
//     // ✅ Fetch employee ID from dashboardData in localStorage
//     const dashboardData = localStorage.getItem('dashboardData');
//     if (dashboardData) {
//       try {
//         const parsedData = JSON.parse(dashboardData);
//         if (parsedData.employeeId) {
//           setUserName(parsedData.employeeId.toString());
//         } else {
//           alert("Employee ID not found in dashboard data.");
//         }
//       } catch (error) {
//         console.error("Error parsing dashboardData:", error);
//         alert("Invalid dashboard data in localStorage.");
//       }
//     } else {
//       alert("Dashboard data not found in localStorage.");
//     }

//     const loadModels = async () => {
//       try {
//         await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//         await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//         await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
//         setModelsLoaded(true);
//       } catch (error) {
//         console.error('Error loading models:', error);
//         alert('Error initializing face recognition models.');
//       }
//     };

//     loadModels();
//   }, []);

//   const startCamera = () => {
//     const video = document.getElementById('video');
//     return new Promise((resolve, reject) => {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then((stream) => {
//           video.srcObject = stream;
//           video.onloadedmetadata = () => {
//             video.play();
//             resolve();
//           };
//         })
//         .catch((error) => {
//           console.error('Camera error:', error);
//           alert('Could not access camera');
//           reject(error);
//         });
//     });
//   };

//   const stopCamera = () => {
//     const video = document.getElementById('video');
//     const stream = video.srcObject;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       video.srcObject = null;
//     }
//   };

//   // const captureFaceData = async () => {
//   //   if (!modelsLoaded) {
//   //     alert('Models not loaded yet.');
//   //     return;
//   //   }

//   //   if (!userName.trim()) {
//   //     alert('Employee ID not found.');
//   //     return;
//   //   }

//   //   try {
//   //     const API_KEY = process.env.REACT_APP_API_KEY;

//   //     const checkResponse = await fetch(`http://localhost:5000/api/face/check/${userName}`, {
//   //       headers: {
//   //         'x-api-key': API_KEY,
//   //       },
//   //     });
//   //     const checkData = await checkResponse.json();
//   //     console.log('Check response:', checkData);

//   //     if (checkData.exists) {
//   //       alert('Face data already exists for this Employee ID.');
//   //       return;
//   //     }

//   //     if (checkData.count > 1) {
//   //       alert(`Multiple entries found for Employee ID ${userName}. Cannot capture face data.`);
//   //       return;
//   //     }
//   //   } catch (error) {
//   //     console.error('Error checking existing face data:', error);
//   //     alert('Failed to check existing face data. Please try again.');
//   //     return;
//   //   }

//   //   setIsCapturing(true);
//   //   await startCamera();

//   //   const video = document.getElementById('video');
//   //   const canvas = faceapi.createCanvasFromMedia(video);
//   //   canvas.id = 'captureCanvas';
//   //   document.body.appendChild(canvas);

//   //   const displaySize = { width: video.width, height: video.height };
//   //   faceapi.matchDimensions(canvas, displaySize);

//   //   let capturedDescriptors = [];
//   //   const instructionDiv = document.createElement('div');
//   //   instructionDiv.classList.add('instruction');
//   //   instructionDiv.id = 'instructionDiv';
//   //   document.body.appendChild(instructionDiv);

//   //   const interval = setInterval(async () => {
//   //     const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//   //       .withFaceLandmarks()
//   //       .withFaceDescriptors();

//   //     const resizedDetections = faceapi.resizeResults(detections, displaySize);
//   //     const ctx = canvas.getContext('2d');
//   //     ctx.clearRect(0, 0, canvas.width, canvas.height);

//   //     if (detections.length === 1) {
//   //       capturedDescriptors.push(detections[0].descriptor);
//   //       faceapi.draw.drawDetections(canvas, resizedDetections);
//   //       instructionDiv.textContent = `Capturing... (${capturedDescriptors.length}/5 samples)`;

//   //       if (capturedDescriptors.length >= 5) {
//   //         clearInterval(interval);
//   //         document.getElementById('captureCanvas')?.remove();
//   //         document.getElementById('instructionDiv')?.remove();
//   //         await saveCapturedFace(capturedDescriptors);
//   //         stopCamera();
//   //         setIsCapturing(false);
//   //       }
//   //     } else {
//   //       faceapi.draw.drawDetections(canvas, resizedDetections);
//   //       instructionDiv.textContent = 'Ensure only one face is visible';
//   //     }
//   //   }, 500);
//   // };

//   const captureFaceData = async () => {
//     if (!modelsLoaded) {
//       alert('Models not loaded yet.');
//       return;
//     }
  
//     if (!userName.trim()) {
//       alert('Employee ID not found.');
//       return;
//     }
  
//     try {
//       const API_KEY = process.env.REACT_APP_API_KEY;
  
//       const checkResponse = await fetch(`http://localhost:5000/api/face/check/${userName}`,
        
//         {
//         headers: {
//           'x-api-key': API_KEY,
//         },
//       });
//       const checkData = await checkResponse.json();
//       console.log('Check response:', checkData);
  
//       if (checkData.exists) {
//         alert('Face data already exists for this Employee ID.');
//         return;
//       }
  
//       if (checkData.count > 1) {
//         alert(`Multiple entries found for Employee ID ${userName}. Cannot capture face data.`);
//         return;
//       }
//     } catch (error) {
//       console.error('Error checking existing face data:', error);
//       alert('Failed to check existing face data. Please try again.');
//       return;
//     }
  
//     setIsCapturing(true);
//     await startCamera();
  
//     const video = document.getElementById('video');
//     const canvas = faceapi.createCanvasFromMedia(video);
//     canvas.id = 'captureCanvas';
//     document.body.appendChild(canvas);
  
//     const displaySize = { width: video.width, height: video.height };
//     faceapi.matchDimensions(canvas, displaySize);
  
//     let capturedDescriptors = [];
//     const instructionDiv = document.createElement('div');
//     instructionDiv.classList.add('instruction');
//     instructionDiv.id = 'instructionDiv';
//     document.body.appendChild(instructionDiv);
  
//     const interval = setInterval(async () => {
//       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();
  
//       const resizedDetections = faceapi.resizeResults(detections, displaySize);
//       const ctx = canvas.getContext('2d');
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//       // Brightness check
//       const brightness = estimateVideoBrightness(video);
//       if (brightness < 40) {
//         instructionDiv.textContent = '💡 Low lighting detected. Please move to a brighter area.';
//         return;
//       }
  
//       faceapi.draw.drawDetections(canvas, resizedDetections);
  
//       if (detections.length === 0) {
//         instructionDiv.textContent = '🕵️‍♂️ No face detected. Please look at the camera.';
//       } else if (detections.length > 1) {
//         instructionDiv.textContent = '👥 Multiple faces found. Ensure only one person is in front of the camera.';
//       } else {
//         const box = detections[0].detection.box;
//         if (box.width < 100 || box.height < 100) {
//           instructionDiv.textContent = '📏 Move closer to the camera for better detection.';
//           return;
//         }
  
//         capturedDescriptors.push(detections[0].descriptor);
//         instructionDiv.textContent = `✅ Capturing... (${capturedDescriptors.length}/30 samples)`;
  
//         if (capturedDescriptors.length >= 30) {
//           clearInterval(interval);
//           document.getElementById('captureCanvas')?.remove();
//           document.getElementById('instructionDiv')?.remove();
//           await saveCapturedFace(capturedDescriptors);
//           stopCamera();
//           setIsCapturing(false);
//         }
//       }
//     }, 500);
//   };
  
//   // Utility function for brightness detection
//   function estimateVideoBrightness(video) {
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
  
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
//     const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     let total = 0;
  
//     for (let i = 0; i < frame.data.length; i += 4) {
//       const r = frame.data[i];
//       const g = frame.data[i + 1];
//       const b = frame.data[i + 2];
//       total += (r + g + b) / 3;
//     }
  
//     return total / (frame.data.length / 4);
//   }
  


//   const saveCapturedFace = async (capturedDescriptors) => {
//     const faceData = {
//       employee_id: userName,
//       label: userName,
//       descriptors: capturedDescriptors,
//     };

//     console.log('Face data to be saved:', faceData);

//     const API_KEY = process.env.REACT_APP_API_KEY;

//     if (!API_KEY) {
//       alert('API Key is missing.');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/face/save-face-data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': API_KEY,
//         },
//         body: JSON.stringify(faceData),
//       });

//       const data = await response.json();
//       console.log('Response from server:', data);
//       if (response.ok) {
//         alert(`${data.message}`);
//         onClose?.(); // Close the popup after saving face data
//       } else {
//         alert(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error saving face data:', error);
//       alert('Failed to save face data');
//     }
//   };

//   const handleRecognition = () => {
//     setIsRecognizing((prev) => !prev);
//     if (!isRecognizing) {
//       alert('Recognition will be implemented after saving works.');
//     }
//   };

//   return (
//     <div className="save-face-container">
//       <h2>Save Face Data</h2>
//       <p>Employee ID: <strong>{userName}</strong></p>
//       <div className="video-container">
//         <video id="video" width="640" height="480" autoPlay muted></video>
//       </div>
//       <div className="face-buttons">
//         <button
//           id="saveFace"
//           onClick={captureFaceData}
//           disabled={isCapturing || isRecognizing}
//           className="btn"
//         >
//           {isCapturing ? 'Capturing...' : 'Save My Face'}
//         </button>
//       </div>

      
//     </div>
//   );
// }

// export default SaveFaceData;


import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import './SaveFaceData.css';
import Modal from "../Modal/Modal";

function SaveFaceData({ onClose }) {
  const [userName, setUserName] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

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
    const dashboardData = localStorage.getItem('dashboardData');
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
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setModelsLoaded(true);
      } catch (error) {
        console.error('Error loading models:', error);
        showAlert('Error initializing face recognition models.');
      }
    };

    loadModels();
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Error checking camera:', error);
      return false;
    }
  };

  const startCamera = () => {
    const video = document.getElementById('video');
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            resolve();
          };
        })
        .catch((error) => {
          console.error('Camera error:', error);
          showAlert('Could not access camera');
          reject(error);
        });
    });
  };

  const stopCamera = () => {
    const video = document.getElementById('video');
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const captureFaceData = async () => {
    if (!modelsLoaded) {
      showAlert('Models not loaded yet.');
      return;
    }

    if (!userName.trim()) {
      showAlert('Employee ID not found.');
      return;
    }

    const hasCamera = await checkCameraAvailability();
    if (!hasCamera) {
      showAlert('No camera found on this device. Proceeding without capturing face.');
      return;
    }

    try {
      const API_KEY = process.env.REACT_APP_API_KEY;

const checkResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/face/check/${userName}`, {        headers: {
          'x-api-key': API_KEY,
        },
      });
      const checkData = await checkResponse.json();
      console.log('Check response:', checkData);

      if (checkData.exists) {
        showAlert('Face data already exists for this Employee ID.');
        return;
      }

      if (checkData.count > 1) {
        showAlert(`Multiple entries found for Employee ID ${userName}. Cannot capture face data.`);
        return;
      }
    } catch (error) {
      console.error('Error checking existing face data:', error);
      showAlert('Failed to check existing face data. Please try again.');
      return;
    }

    setIsCapturing(true);
    await startCamera();

    const video = document.getElementById('video');
    const canvas = faceapi.createCanvasFromMedia(video);
    canvas.id = 'captureCanvas';
    document.body.appendChild(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    let capturedDescriptors = [];
    const instructionDiv = document.createElement('div');
    instructionDiv.classList.add('instruction');
    instructionDiv.id = 'instructionDiv';
    document.body.appendChild(instructionDiv);

    const interval = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const brightness = estimateVideoBrightness(video);
      if (brightness < 40) {
        instructionDiv.textContent = '💡 Low lighting detected. Please move to a brighter area.';
        return;
      }

      faceapi.draw.drawDetections(canvas, resizedDetections);

      if (detections.length === 0) {
        instructionDiv.textContent = '🕵️‍♂️ No face detected. Please look at the camera.';
      } else if (detections.length > 1) {
        instructionDiv.textContent = '👥 Multiple faces found. Ensure only one person is in front of the camera.';
      } else {
        const box = detections[0].detection.box;
        if (box.width < 100 || box.height < 100) {
          instructionDiv.textContent = '📏 Move closer to the camera for better detection.';
          return;
        }

        capturedDescriptors.push(detections[0].descriptor);
        instructionDiv.textContent = `✅ Capturing... (${capturedDescriptors.length}/30 samples)`;

        if (capturedDescriptors.length >= 30) {
          clearInterval(interval);
          document.getElementById('captureCanvas')?.remove();
          document.getElementById('instructionDiv')?.remove();
          await saveCapturedFace(capturedDescriptors);
          stopCamera();
          setIsCapturing(false);
        }
      }
    }, 500);
  };

  function estimateVideoBrightness(video) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
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

    console.log('Face data to be saved:', faceData);

    const API_KEY = process.env.REACT_APP_API_KEY;

    if (!API_KEY) {
      showAlert('API Key is missing.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/face/save-face-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(faceData),
      });

      const data = await response.json();
      console.log('Response from server:', data);
      // if (response.ok) {
      //   showAlert(`${data.message}`);
      //   onClose?.();
      // } else {
      //   showAlert(`Error: ${data.error}`);
      // }

      if (response.ok) {
        showAlert(`${data.message}`);
        setTimeout(() => {
          closeAlert();
          onClose?.();
        }, 2000); // Show popup for 2 seconds
      } else {
        showAlert(`Error: ${data.error}`);
      }
      
    } catch (error) {
      console.error('Error saving face data:', error);
      showAlert('Failed to save face data');
    }
  };

  const handleRecognition = () => {
    setIsRecognizing((prev) => !prev);
    if (!isRecognizing) {
      showAlert('Recognition will be implemented after saving works.');
    }
  };

  return (
    <div className="save-face-container">
      <h2>Save Face Data</h2>
      <p>Employee ID: <strong>{userName}</strong></p>
      <div className="video-container">
        <video id="video" width="640" height="480" autoPlay muted></video>
      </div>
      <div className="face-buttons">
        <button
          id="saveFace"
          onClick={captureFaceData}
          disabled={isCapturing || isRecognizing}
          className="btn"
        >
          {isCapturing ? 'Capturing...' : 'Save My Face'}
        </button>
      </div>
       {/* Alert Modal for displaying messages */}
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
