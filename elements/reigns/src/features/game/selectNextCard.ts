import { Card, GameDefinition, GameFlags, GameState } from "./types";
import { getConditions } from "./validateGameDefinition";
import * as self from './selectNextCard';

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
  flags: GameFlags,
  designerCards: Card[] | null = null,
  previouslySelectedCards: Pick<Card, "card" | "cooldown">[]
) => {
  if (!definition) {
    return [];
  }
  const restrictedByFlags = cardsRestrictedByFlags(
    designerCards ?? definition.cards,
    flags
  );

  const coolCards = filterHotCards(
    restrictedByFlags,
    previouslySelectedCards
  );

  return cardsDistributedByWeight(coolCards);
};

export const selectNextCard = (
  definition: GameDefinition | null,
  flags: GameFlags,
  designerCards: Card[] | undefined,
  previouslySelectedCards: Pick<Card, "card" | "cooldown">[],
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

export const filterHotCards = (
  allCards: Card[],
  hotCards: Pick<Card, "card" | "cooldown">[]
) => {

  if (hotCards.length === 0) {
    return allCards;
  }

  const coldCards = allCards.filter(self.filterHotCardFactory(hotCards));

  if (coldCards.length > 0) {
    return coldCards;
  }

  return allCards;
};

export function filterHotCardFactory(
  hotCards: Pick<Card, "card" | "cooldown">[],
): (value: Card) => unknown {
  const round =  hotCards.length + 1;

  return (card) => {
    const lastPlayedIndex = hotCards.findIndex(
      (hotCard) => hotCard.card === card.card
    );
    if (lastPlayedIndex === -1) {
      // card was not never selected
      return true;
    }
    const hotCard = hotCards[lastPlayedIndex];

    const cooldownValue = hotCard.cooldown ?? Infinity;
    const lastVisibleRound = hotCards.length - lastPlayedIndex;

    return round > lastVisibleRound + cooldownValue;
  };
}
