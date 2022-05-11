import React from "react";
import { useSelector } from "react-redux";
import { IAppState } from "./features/game/types";

export const Meter = ({ src, percent }: { src: string; percent: number; }) => {
  const assetsUrl = useSelector((state: IAppState) => state.game.definition?.assetsUrl);

  return (
    <div className="meter">
      <div className="meter__percent" style={{ height: percent + "%" }} />
      <img src={`${assetsUrl}/${src}`} />
    </div>
  );
};
