import React from "react";

export const YesAnswer = ({ text }: { text: string }) => {
  return (
    <div className="answer answer--yes">
      <div className="answer__zone"></div>
      <div className="answer__text">{text}</div>
    </div>
  );
};
