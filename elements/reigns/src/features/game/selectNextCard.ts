import { Card, GameDefinition, GameFlags, GameState } from "./types";
import { getConditions } from "./validateGameDefinition";

export const cardsDistributedByWeight = (cards: Card[]) =>
  cards.flatMap((card) => [...Array(card.weight).keys()].map(() => card));

export const cardsRestrictedByFlags = (cards: Card[], gameFlags: GameFlags) =>
  cards.filter((card) => {
    if (!card.conditions) return card;
    const conditions = getConditions(card);
    return conditions.every(({ key, value }) => {
      const flag = gameFlags[key];
      if (flag === undefined) {
        return value === "false";
      }
      return flag === value;
    });
  });

const getAllValidCards = (
  definition: GameDefinition | null,
  flags: GameFlags
) => {
  if (!definition) {
    return [];
  }
  const restrictedByFlags = cardsRestrictedByFlags(definition.cards, flags);
  return cardsDistributedByWeight(restrictedByFlags);
};

export const selectNextCard = (
  definition: GameDefinition | null,
  flags: GameFlags
) => {
  const validCards = getAllValidCards(definition, flags);
  const randomCard = validCards[Math.floor(Math.random() * validCards.length)];

  return {
    ...randomCard,
  };
};
