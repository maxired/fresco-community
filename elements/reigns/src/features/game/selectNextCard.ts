import { Card, GameFlags, GameState } from "./types";
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

const getAllValidCards = (state: GameState) => {
  if (!state.definition) {
    return [];
  }
  const restrictedByFlags = cardsRestrictedByFlags(
    state.definition.cards,
    state.flags
  );
  return cardsDistributedByWeight(restrictedByFlags);
};

export const selectNextCard = (state: GameState) => {
  const validCards = getAllValidCards(state);
  const randomCard = validCards[Math.floor(Math.random() * validCards.length)];

  return {
    ...randomCard,
    selectionId: `${Date.now() - Math.floor(Math.random() * 1000)}`,
  };
};
