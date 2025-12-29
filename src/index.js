// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// <>
//   <title>STS website</title>

//   <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
// </>;
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Global CSS including font-face
import App from "./App";
import "@fortawesome/fontawesome-free/css/all.min.css";

// ReactDOM render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
