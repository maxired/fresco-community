import React from "react";
import { useSelector } from "react-redux";

export const Meter = ({ src, percent }) => {
  const assetsUrl = useSelector((state) => state.game.definition?.assetsUrl);

  return (
    <div className="meter">
      <div className="meter__percent" style={{ height: percent + "%" }} />
      <img src={`${assetsUrl}/${src}`} />
    </div>
  );
};
