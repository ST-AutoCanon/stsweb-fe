// TextNoteFlow.jsx
import React, { useState, useEffect } from "react";
import "./VoiceNoteFlow.css"; // for styling
import { prompts } from "./Prompts";

export default function TextNoteFlow({
  step,
  answers,
  isLoading = false,
  onSave, // (updatedAnswers) => void
  onCancel, // () => void
}) {
  const [drafts, setDrafts] = useState(answers);
  const [isEditingAll, setIsEditingAll] = useState(false);

  // whenever parent clears or steps change, sync
  useEffect(() => {
    setDrafts(answers);
  }, [answers]);

  const handleChange = (idx, val) => {
    setDrafts((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const isLast = step === prompts.length;
  const currentVal = (drafts[step - 1] || "").trim();

  return (
    <div className="voice-flow-step">
      {prompts.slice(0, step).map((prompt, i) => (
        <div key={i} className="conversation-block">
          <p className="prompt">{prompt}</p>
          {i === step - 1 || isEditingAll ? (
            <textarea
              className="answer-input"
              rows={3}
              autoFocus={i === step - 1}
              value={drafts[i] || ""}
              onChange={(e) => handleChange(i, e.target.value)}
            />
          ) : (
            <p className="answer">{answers[i]}</p>
          )}
        </div>
      ))}

      {isLoading && <p className="loading-text">Saving…</p>}

      {/* between 1 and N-1: show Next/Cancel */}
      {!isLast ? (
        <div className="button-row">
          <button className="btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn save"
            disabled={!currentVal}
            onClick={() => onSave(drafts)}
          >
            Next
          </button>
        </div>
      ) : (
        // final step: full Cancel/Edit/Save
        <div className="button-row">
          {!isEditingAll ? (
            <>
              <button className="btn cancel" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="btn edit"
                onClick={() => setIsEditingAll(true)}
              >
                Edit
              </button>
              <button
                className="btn save"
                disabled={!currentVal}
                onClick={() => onSave(drafts)}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                className="btn cancel"
                onClick={() => {
                  setDrafts(answers);
                  setIsEditingAll(false);
                  onCancel?.();
                }}
              >
                Cancel
              </button>
              <button
                className="btn save"
                disabled={!currentVal}
                onClick={() => {
                  onSave(drafts);
                  setIsEditingAll(false);
                }}
              >
                Save
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
