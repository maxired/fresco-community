import { Meter } from "./Meter";
import { GameDefinition } from "./features/game/types";

export const Header = ({
  definition,
  stats
}: {
  definition: GameDefinition;
  stats: number[];
}) => {
  return (
    <div className="block header">
      <div className="meters">
        {definition.stats.map((stat, ix) => (
          <Meter
            key={stat.icon}
            src={stat.icon}
            percent={stats[ix]}
            name={stat.name}
          />
        ))}
      </div>
    </div>
  );
};
