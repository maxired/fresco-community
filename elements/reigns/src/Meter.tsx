import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "./store";

export const Meter = ({
  src,
  percent,
  name,
}: {
  src: string;
  percent: number;
  name: string;
}) => {
  const assetsUrl = useSelector(
    (state: AppState) => state.game.definition?.assetsUrl
  );

  return (
    <div className="meter" title={name}>
      <div className="meter__percent" style={{ height: percent + "%" }} />
      <img src={`${assetsUrl}/${src}`} />
    </div>
  );
};
