
import React from "react";
import "./BirthdayCard.css";

const BirthdayCard = ({ name }) => {
  console.log("🎈 BirthdayCard name:", name);

  const blast = Array.from({ length: 1000 }, (_, i) => (
    <div key={i} className="blast-piece" style={{ "--i": i }} />
  ));

  return (
    <div className="birthday-card">
      <div className="birthday-blast-container">{blast}</div>
      <div className="sparkles">🎉🎂🎉</div>
      <h2>🎉 Happy Birthday, {name}! 🎉</h2>
      <p>
        sukalpatechsolutions Wishing you a day filled with joy, success, and celebration.
         🎂🎈
      </p>
    </div>
  );
};

export default BirthdayCard;
