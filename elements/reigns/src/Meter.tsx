import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "./features/game/types";

export const Meter = ({ src, percent }: { src: string; percent: number }) => {
  const assetsUrl = useSelector(
    (state: AppState) => state.game.definition?.assetsUrl
  );

  return (
    <div className="meter">
      <div className="meter__percent" style={{ height: percent + "%" }} />
      <img src={`${assetsUrl}/${src}`} />
    </div>
  );
};
