import React from "react";

export const AnswerArea = ({
  text,
  answer,
}: {
  text: string;
  answer: "yes" | "no";
}) => {
  return (
    <div className="answer">
      <div className="answer__text-container">
        <div className="answer__text">{text}</div>
      </div>
      <div className={`answer__zone answer--${answer}`}></div>
    </div>
  );
};
