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

    getFlags(card, "yes_custom", i + 1);
    getFlags(card, "no_custom", i + 1);
  }

  return cards;
};

const FLAG_SEPARATOR = " ";
const FLAG_KEY_VALUE_SEPARATOR = "=";

export const getFlags = (
  card: Card,
  field: "yes_custom" | "no_custom",
  cardNumber?: number
): CardFlag[] => {
  const shouldValidate = typeof cardNumber == "number";
  const allowedValues = ["true", "false"];
  if (!card[field]) {
    return [];
  }
  const flags = card[field].split(FLAG_SEPARATOR).map((flag) => {
    const [key, value, other] = flag.split(FLAG_KEY_VALUE_SEPARATOR);
    if (shouldValidate) {
      if (!key || !value || other) {
        throw new Error(`Card ${cardNumber} has invalid ${field}`);
      }
      if (!allowedValues.includes(value)) {
        throw new Error(
          `Card ${cardNumber} has invalid ${field}, value must be ${allowedValues.join(
            " or "
          )}`
        );
      }
    }
    return { key, value };
  });
  if (shouldValidate) {
    if ([...new Set(flags.map((flag) => flag.key))].length !== flags.length) {
      throw new Error(`Card ${cardNumber} has duplicate flag in ${field}`);
    }
  }
  return flags;
};
