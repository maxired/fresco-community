import React from "react";

export const YesAnswer = ({ text, onClick }) => {
    return (
      <div className="answer answer--yes" onClick={onClick}>
        <div className="answer__zone"></div>
        <div className="answer__text">{text}</div>
      </div>
    );
  };