import React from "react";

export const NoAnswer = ({ text, onClick }) => {
    return (
      <div className="answer answer--no" onClick={onClick}>
        <div className="answer__zone"></div>
        <div className="answer__text">{text}</div>
      </div>
    );
  };