import { Card, GameFlags, GameState } from "./types";

export const cardsDistributedByWeight = (cards: Card[]) =>
  cards.flatMap((card) => [...Array(card.weight).keys()].map(() => card));

export const cardsRestrictedByFlags = (cards: Card[], flags: GameFlags) =>
  cards.filter((card) => card);

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
  return randomCard;
};
