import { Meter } from "./Meter";
import React from "react";
export const Meters = ({ stats }) => {
    return (
      <div className="block meters">
        {stats.map((stat) => (
          <Meter key={stat.icon} src={stat.icon} percent={stat.value} />
        ))}
      </div>
    );
  };
  