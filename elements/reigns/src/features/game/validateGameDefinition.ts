import { Card, CardFlag, GameDefinition } from "./types";

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

    validateFlags(getFlags(card, "yes_custom"), "yes_custom", i + 1);
    validateFlags(getFlags(card, "no_custom"), "no_custom", i + 1);
  }

  return cards;
};

const FLAG_SEPARATOR = " ";
const FLAG_KEY_VALUE_SEPARATOR = "=";
type FlagFields = "yes_custom" | "no_custom";

export const validateFlags = (
  flags: CardFlag[],
  field: FlagFields,
  cardNumber: number
) => {
  const allowedValues = ["true", "false"];
  flags.forEach((flag, ix) => {
    if (!allowedValues.includes(flag.value)) {
      throw new Error(
        `Card ${
          ix + 1
        } has invalid ${field}, value must be ${allowedValues.join(" or ")}`
      );
    }
  });
  if ([...new Set(flags.map((flag) => flag.key))].length !== flags.length) {
    throw new Error(`Card ${cardNumber} has duplicate flag in ${field}`);
  }
};

export const getFlags = (card: Card, field: FlagFields): CardFlag[] => {
  if (!card[field]) {
    return [];
  }

  const flags = card[field].split(FLAG_SEPARATOR).map((flag) => {
    const [key, value] = flag.split(FLAG_KEY_VALUE_SEPARATOR);
    return { key, value };
  });

  return flags;
};
