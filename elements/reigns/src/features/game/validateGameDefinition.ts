import { Card, GameDefinition } from "./types";

export const validateGameDefinition = (
  definition: GameDefinition
): GameDefinition => ({
  ...definition,
  ...validateCards(definition.cards),
});

export const validateCards = (cards: Card[] | undefined) => {
  if (!cards || cards.length === 0) {
    throw new Error("No cards found");
  }

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (!card.card) {
      throw new Error(`Card ${i + 1} is invalid`);
    }
    if (!card.weight || card.weight < 0) {
      throw new Error(
        `Card ${i + 1} is invalid, weight must be greater than 0`
      );
    }
    if (card.weight > 100) {
      throw new Error(`Card ${i + 1} is invalid, weight must be less than 100`);
    }
  }

  return cards;
};
