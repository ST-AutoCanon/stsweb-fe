import React, { useState, useEffect } from "react";
import "./VoiceNoteFlow.css";
import { prompts } from "./Prompts";

export default function VoiceNoteFlow({
  step,
  answers,
  isLoading,
  onSave, // (updatedAnswers: string[]) => void
  onCancel, // () => void
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [drafts, setDrafts] = useState(answers);

  // Reset drafts whenever answers prop changes
  useEffect(() => {
    setDrafts(answers);
  }, [answers]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setDrafts(answers);
    setIsEditing(false);
    onCancel?.();
  };
  const handleSave = () => {
    onSave?.(drafts);
    setIsEditing(false);
  };

  const handleChange = (idx, value) => {
    setDrafts((d) => {
      const copy = [...d];
      copy[idx] = value;
      return copy;
    });
  };

  // Only show buttons after the final prompt has an answer
  const allQuestionsCompleted =
    step >= prompts.length && answers[prompts.length - 1]?.trim().length > 0;

  return (
    <div className="voice-flow-step">
      {prompts.slice(0, step).map((prompt, i) => (
        <div key={i} className="conversation-block">
          <p className="prompt">{prompt}</p>

          {isEditing ? (
            <textarea
              className="answer-input"
              value={drafts[i] || ""}
              onChange={(e) => handleChange(i, e.target.value)}
              rows={3}
            />
          ) : (
            <p className="answer">{answers[i]}</p>
          )}
        </div>
      ))}

      {isLoading && <p className="loading-text">Processing…</p>}

      {allQuestionsCompleted && (
        <div className="button-row">
          {!isEditing ? (
            <>
              <button className="btn cancel" onClick={onCancel}>
                Cancel
              </button>
              <button className="btn edit" onClick={handleEdit}>
                Edit
              </button>
              <button className="btn save" onClick={() => onSave?.(answers)}>
                Save
              </button>
            </>
          ) : (
            <>
              <button className="btn cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn save" onClick={handleSave}>
                Save
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
