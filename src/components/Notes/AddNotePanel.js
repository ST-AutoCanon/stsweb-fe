// AddNotePanel.jsx
import React, { useState, useRef, useEffect } from "react";
import { Mic } from "lucide-react";
import { prompts } from "./Prompts";
import VoiceNoteFlow from "./VoiceNoteFlow";
import TextNoteFlow from "./TextNoteFlow";
import ScanNoteFlow from "./ScanNoteFlow";
import "./AddNotePanel.css";
import { LiaUserEditSolid } from "react-icons/lia";
import { LuScanLine } from "react-icons/lu";
import { postVoiceDialog, postVoiceFinal } from "./api";

const fullName =
  JSON.parse(localStorage.getItem("dashboardData") || "{}").name || "";
const firstName = fullName.trim().split(" ").filter(Boolean)[0] || "";

export default function AddNotePanel({ onDone }) {
  const [mode, setMode] = useState(null); // "voice" | "text" | "scan" | "summary"
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState(Array(prompts.length).fill(""));
  const [recording, setRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // ——————— Voice helpers ———————
  const startRecording = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = s;
      const recorder = new MediaRecorder(s, { mimeType: "audio/webm" });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) =>
        e.data.size && audioChunksRef.current.push(e.data);
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      alert("Mic unavailable.");
    }
  };

  const stopAndRecognize = async () => {
    const rec = mediaRecorderRef.current;
    if (!rec) return;

    setRecording(false);
    setIsLoading(true);

    // wait for recorder to finish
    await new Promise((r) => {
      rec.onstop = r;
      rec.stop();
    });

    // tear down the mic stream
    streamRef.current.getTracks().forEach((t) => t.stop());

    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    if (!blob.size) {
      alert("No audio captured.");
      setIsLoading(false);
      return;
    }

    // send to your backend
    const res = await postVoiceDialog(blob, step);
    setIsLoading(false);
    if (!res.success) return alert(res.message);

    // shove the transcription into the correct slot
    setAnswers((a) => {
      const copy = [...a];
      copy[step - 1] = res.text;
      return copy;
    });

    // advance to next prompt if there is one
    if (step < prompts.length) {
      setStep((s) => s + 1);
    }
  };

  // ——————— Final save (shared) ———————
  const handleSaveAnswers = async (finalAnswers) => {
    setAnswers(finalAnswers);
    setIsLoading(true);
    const payload = {
      purpose: finalAnswers[0],
      client_company: finalAnswers[1],
      contact_person: finalAnswers[2],
      description: finalAnswers[3],
      action_points: finalAnswers[4],
      assigned_to: finalAnswers[5],
      follow_up_date: finalAnswers[6],
    };
    const done = await postVoiceFinal(payload);
    setIsLoading(false);
    if (done.success) {
      setCurrentRecord(done.record);
      setMode("summary");
    } else {
      alert(done.message || "Save failed");
    }
  };

  // ——————— Cleanup on unmount ———————
  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop?.();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ——————— Render ———————
  return (
    <div className="add-panel">
      <div className="add-panel-header">
        <h2>
          <img src="images/aicon.png" className="header-icon"></img>Hey{" "}
          {firstName},
        </h2>
      </div>

      <div className="add-panel-body">
        {mode === "voice" && (
          <VoiceNoteFlow
            step={step}
            answers={answers}
            isLoading={isLoading}
            onSave={handleSaveAnswers}
            onCancel={() => {
              setMode(null);
              setStep(1);
              setAnswers(Array(prompts.length).fill(""));
            }}
          />
        )}
        {mode === "text" && (
          <TextNoteFlow
            step={step}
            answers={answers}
            isLoading={isLoading}
            onSave={(newDrafts) => {
              setAnswers(newDrafts);
              // if not last step, advance
              if (step < prompts.length) {
                setStep((s) => s + 1);
              } else {
                // finished all steps, now submit exactly like voice
                handleSaveAnswers(newDrafts);
              }
            }}
            onCancel={() => {
              setMode(null);
              setStep(1);
              setAnswers(Array(prompts.length).fill(""));
            }}
          />
        )}
        {mode === "scan" && (
          <ScanNoteFlow
            onDone={(record) => {
              // we already got the fully created record
              setCurrentRecord(record);
              setMode("summary");
            }}
            onCancel={() => setMode(null)}
          />
        )}
      </div>

      <div className="add-panel-footer-icons">
        {/* Voice toggle */}
        <button
          onClick={() => {
            if (mode !== "voice") {
              setMode("voice");
              setStep(1);
              setAnswers(Array(prompts.length).fill(""));
            } else if (!recording) {
              startRecording();
            } else {
              stopAndRecognize();
            }
          }}
          title="Voice note"
        >
          <Mic size={24} className={recording ? "recording" : ""} />
        </button>

        {/* Plain text toggle */}
        <button
          onClick={() => {
            setMode("text");
            setStep(1);
            setAnswers(Array(prompts.length).fill(""));
          }}
          title="Plain note"
        >
          <LiaUserEditSolid size={24} />
        </button>

        {/* Scan note */}
        <button onClick={() => setMode("scan")} title="Scan note">
          <LuScanLine size={24} />
        </button>
      </div>
    </div>
  );
}
