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
  flags: GameFlags,
  designerCards: Card[] | null = null,
  round: number,
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
    round,
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
  round: number
) => {
  const validCards = getAllValidCards(
    definition,
    flags,
    designerCards,
    round,
    previouslySelectedCards
  );
  const randomCard = validCards[Math.floor(Math.random() * validCards.length)];

  return {
    ...randomCard,
  };
};

export const filterHotCards = (
  round: number,
  allCards: Card[],
  hotCards: Pick<Card, "card" | "cooldown">[]
) => {
  if (round < 2) {
    return allCards;
  }

  const coldCards = allCards.filter(filterHotCard(hotCards, round));

  if (coldCards.length > 0) {
    return coldCards;
  }

  return allCards;
};

function filterHotCard(
  hotCards: Pick<Card, "card" | "cooldown">[],
  round: number
): (value: Card, index: number, array: Card[]) => unknown {
  return (card) => {
    const lastPlayedIndex = hotCards.findIndex(
      (hotCard) => hotCard.card === card.card
    );
    if (lastPlayedIndex === -1) {
      //card was not played
      return true;
    }
    const hotCard = hotCards[lastPlayedIndex];

    const cooldownValue = hotCard.cooldown ?? Infinity;
    const lastVisibleRound = hotCards.length - (lastPlayedIndex + 1);

    return round > lastVisibleRound + cooldownValue;
  };
}
