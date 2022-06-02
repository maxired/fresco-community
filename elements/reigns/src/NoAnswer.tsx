import React from "react";

export const NoAnswer = ({ text }: { text: string }) => {
  return (
    <div className="answer answer--no">
      <div className="answer__zone"></div>
      <div className="answer__text">{text}</div>
    </div>
  );
};
