import React, { useRef } from "react";
import axios from "axios";
import "./FileUpload.css";
import { FaPaperclip } from "react-icons/fa";

export default function FileUpload({ onUpload }) {
  const inp = useRef();
  const API_KEY = process.env.REACT_APP_API_KEY;
  const headers = {
    "x-api-key": API_KEY,
    "x-employee-id": localStorage.getItem("dashboardData")
      ? JSON.parse(localStorage.getItem("dashboardData")).employeeId
      : null,
  };
  const pick = () => inp.current.click();
  const change = async (e) => {
    const fd = new FormData();
    fd.append("file", e.target.files[0]);
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/upload`,
      fd,
      { headers }
    );
    onUpload(data.url);
  };
  return (
    <>
      <button className="icon-btn" onClick={pick}>
        <FaPaperclip />
      </button>
      <input
        ref={inp}
        type="file"
        onChange={change}
        style={{ display: "none" }}
      />
    </>
  );
}
