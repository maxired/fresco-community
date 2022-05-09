import React from "react";

export const Meter = ({ src, percent }) => {
    return (
      <div className="meter">
        <div className="meter__percent" style={{ height: percent + "%" }} />
        <img src={src} />
      </div>
    );
  };
  