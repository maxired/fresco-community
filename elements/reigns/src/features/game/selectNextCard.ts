import { Card, GameDefinition, GameFlags } from "./types";
import { getConditions } from "./validateGameDefinition";
import * as self from "./selectNextCard";
import { INFINITE_CARD_WEIGHT } from "../../constants";

export const cardsDistributedByWeight = (cards: Card[]) => {
  const cardWithMaximumWeights = cards.filter(
    (card) => card.weight === INFINITE_CARD_WEIGHT
  );
  if (cardWithMaximumWeights.length > 0) {
    return cardWithMaximumWeights;
  }

  return cards.flatMap((card) =>
    [...Array(card.weight).keys()].map(() => card)
  );
};

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
  flags: GameFlags,
  designerCards: Card[] | null = null,
  previouslySelectedCards: Card[]
) => {
  if (!definition) {
    return [];
  }
  const restrictedByFlags = cardsRestrictedByFlags(
    designerCards ?? definition.cards,
    flags
  );

  const availableCards = removeCoolingCards(
    restrictedByFlags,
    previouslySelectedCards
  );

  return cardsDistributedByWeight(availableCards);
};

export const selectNextCard = (
  definition: GameDefinition | null,
  flags: GameFlags,
  designerCards: Card[] | undefined,
  previouslySelectedCards: Card[]
) => {
  const validCards = getAllValidCards(
    definition,
    flags,
    designerCards,
    previouslySelectedCards
  );

  const randomCard = validCards[Math.floor(Math.random() * validCards.length)];

  return {
    ...randomCard,
  };
};

export const removeCoolingCards = (
  allCards: Card[],
  previousCardRounds: Card[]
) => {
  if (previousCardRounds.length === 0) {
    return allCards;
  }

  const coldCards = allCards.filter(
    (card) => !self.isCardCooling(previousCardRounds, card)
  );

  if (coldCards.length > 0) {
    return coldCards;
  }

  return allCards;
};

export function isCardCooling(previousCardRounds: Card[], card: Card): boolean {
  const round = previousCardRounds.length + 1;

  const lastPlayedIndex = previousCardRounds.findIndex(
    (previousCard) => previousCard.id === card.id
  );

  if (lastPlayedIndex === -1) {
    // card was not never selected
    return false;
  }
  const previousCard = previousCardRounds[lastPlayedIndex];

  const cooldownValue = previousCard.cooldown ?? Infinity;
  const lastVisibleRound = previousCardRounds.length - lastPlayedIndex;

  return !(round > lastVisibleRound + cooldownValue);
}
