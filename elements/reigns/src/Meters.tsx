import { Meter } from "./Meter";
import { GameDefinition } from "./features/game/types";

export const Meters = ({
  definition,
  stats,
}: {
  definition: GameDefinition;
  stats: number[];
}) => {
  return (
    <div className="block meters">
      {definition.stats.map((stat, ix) => (
        <Meter key={stat.icon} src={stat.icon} percent={stats[ix]} />
      ))}
    </div>
  );
};
