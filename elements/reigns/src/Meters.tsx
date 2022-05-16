import { Meter } from "./Meter";
import React from "react";
import { Stat } from "./features/game/types";

export const Meters = ({ stats }: { stats: Stat[] }) => {
  return (
    <div className="block meters">
      {stats.map((stat) => (
        <Meter key={stat.icon} src={stat.icon} percent={stat.value} />
      ))}
    </div>
  );
};
