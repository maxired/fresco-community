import { GameDefinition } from "../../features/game/types";

export const getEndMessage = (
  gameDefinition: GameDefinition,
  statsValues: number[],
  isGameWon: boolean
) => {
  if (isGameWon) {
    return gameDefinition.victoryMessage;
  }

  const emptyIndex = statsValues.findIndex((statValue) => statValue <= 0);
  if (emptyIndex > -1) {
    return (
      gameDefinition.stats[emptyIndex].deathMessage ??
      gameDefinition.deathMessage
    );
  }

  return gameDefinition.deathMessage;
};
