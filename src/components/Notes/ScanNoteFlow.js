import React, { useState } from "react";
import Tesseract from "tesseract.js";
import referenceImg from "../../assets/images/reference-note.png";
import "./ScanNoteFlow.css";

export default function ScanNoteFlow({ onDone, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState("");

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const {
      data: { text },
    } = await Tesseract.recognize(file, "eng");
    setLoading(false);
    setOcrText(text);
    extractFields(text);
  }

  async function extractFields(rawText) {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/scan-final`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
            "x-employee-id": JSON.parse(
              localStorage.getItem("dashboardData") || "{}"
            ).employeeId,
          },
          body: JSON.stringify({ ocr_text: rawText }),
        }
      );
      const json = await resp.json();
      if (json.success) {
        onDone(json.record);
      } else {
        alert("Extraction failed: " + json.message);
      }
    } catch (err) {
      console.error(err);
      alert("Extraction error");
    }
  }

  return (
    <div className="scan-flow">
      <section className="scan-flow__reference">
        <h5 className="scan-flow__reference-title">Example for scan:</h5>
        <img
          src={referenceImg}
          alt="Hand-written meeting note example"
          className="scan-flow__reference-img"
        />
      </section>

      <section className="scan-flow__upload">
        <p className="scan-flow__prompt">
          Please upload a photo or scan containing <strong>all</strong> meeting
          details.
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="scan-flow__file-input"
        />

        {loading && <p className="scan-flow__loading">Scanning…</p>}

        {ocrText && (
          <div className="scan-flow__transcript">
            <h5 className="scan-flow__transcript-title">Raw OCR text:</h5>
            <pre className="scan-flow__transcript-content">{ocrText}</pre>
          </div>
        )}

        <button className="scan-flow__cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </section>
    </div>
  );
}
