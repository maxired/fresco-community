import { Card, GameState } from "./types";

export const cardsDistributedByWeight = (cards: Card[]) =>
  cards.flatMap((card) => [...Array(card.weight).keys()].map(() => card));

function getAllValidCards(state: GameState) {
  return state.definition
    ? cardsDistributedByWeight(state.definition.cards)
    : [];
}

export const selectNextCard = (state: GameState) => {
  const validCards = getAllValidCards(state);
  const randomCard = validCards[Math.floor(Math.random() * validCards.length)];
  console.log("New card selected", randomCard.card);
  return randomCard;
};
