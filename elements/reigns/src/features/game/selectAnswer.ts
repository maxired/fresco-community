import { GamePhase } from "../../constants";
import { selectNextCard } from "./selectNextCard";
import {
  Card,
  CardFlag,
  GameFlags,
  GameState,
  PersistedGameState,
} from "./types";
import { FlagFields, getFlags } from "./validateGameDefinition";

const getCardStats = (
  card: Card,
  flagField: Extract<FlagFields, "no_custom" | "yes_custom">
) => {
  switch (flagField) {
    case "no_custom":
      return [card.no_stat1, card.no_stat2, card.no_stat3, card.no_stat4];
    case "yes_custom":
      return [card.yes_stat1, card.yes_stat2, card.yes_stat3, card.yes_stat4];
  }
};

export const selectAnswer = (
  state: GameState,
  cardFlag: Extract<FlagFields, "no_custom" | "yes_custom">
): PersistedGameState => {
  const cardStats = getCardStats(state.selectedCard!, cardFlag);
  const stats = cardStats.map((cardStatValue, ix) => {
    const currentStat = state.stats[ix];
    if (!cardStatValue) return currentStat;
    return {
      icon: currentStat.icon,
      value: updateValue(cardStatValue, currentStat.value),
    };
  });

  const flags = setFlags(state.flags, getFlags(state.selectedCard!, cardFlag));

  const phase = stats.filter((_, ix) => cardStats[ix]).some((p) => p.value <= 0)
    ? GamePhase.ENDED
    : GamePhase.STARTED;

  const round = state.round + 1;

  const selectedCard = selectNextCard(state.definition, flags);

  return {
    phase,
    round,
    stats,
    flags,
    selectedCard,
  };
};

export const setFlags = (gameFlags: GameFlags, cardFlags: CardFlag[]) => {
  const flags = { ...gameFlags };
  cardFlags.forEach(({ key, value }) => {
    flags[key] = value;
  });
  return flags;
};

function updateValue(update: number, currentValue: number): number {
  if (!update) {
    return 0;
  }
  let result = currentValue;
  result += update;
  result = Math.min(100, Math.max(0, result));
  return result;
}
