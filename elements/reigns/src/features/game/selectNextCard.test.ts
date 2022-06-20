import * as selectNextCard from "./selectNextCard";

import { Card } from "./types";

const {
  cardsDistributedByWeight,
  cardsRestrictedByFlags,
  isCardCooling,
  removeCoolingCards,
} = selectNextCard;

describe("selectNextCard", () => {
  describe("cardsDistributedByWeight", () => {
    it("distributes cards by weight", () => {
      const result = cardsDistributedByWeight([
        { card: "card1", weight: 1 } as Card,
        { card: "card2", weight: 5 } as Card,
      ]);

      expect(result.filter((p) => p.card === "card1").length).toBe(1);
      expect(result.filter((p) => p.card === "card2").length).toBe(5);
    });
  });

  describe("cardsRestrictedByFlags", () => {
    it("should return cards not affected by flags", () => {
      const result = cardsRestrictedByFlags(
        [{ card: "a card", weight: 1 } as Card],
        {}
      );
      expect(result).toEqual(
        expect.arrayContaining([expect.objectContaining({ card: "a card" })])
      );
    });

    it("should return cards affected by flag==true when game flag is set", () => {
      const result = cardsRestrictedByFlags(
        [{ card: "a card", weight: 1, conditions: "flag==true" } as Card],
        { flag: "true" }
      );
      expect(result).toHaveLength(1);
    });

    it("should return cards affected by flag==false when game flag is set", () => {
      const result = cardsRestrictedByFlags(
        [{ card: "a card", weight: 1, conditions: "flag==false" } as Card],
        { flag: "false" }
      );
      expect(result).toHaveLength(1);
    });

    it("should exclude cards affected by flag==true when game flag is not set", () => {
      const result = cardsRestrictedByFlags(
        [{ card: "a card", weight: 1, conditions: "flag==true" } as Card],
        {}
      );
      expect(result).toHaveLength(0);
    });

    it("should return cards affected by flag==false when game flag is not set", () => {
      const result = cardsRestrictedByFlags(
        [{ card: "a card", weight: 1, conditions: "flag==false" } as Card],
        {}
      );
      expect(result).toHaveLength(1);
    });

    it("should return cards without conditions when flags are active", () => {
      const result = cardsRestrictedByFlags(
        [{ card: "a card", weight: 1 } as Card],
        { flag: "true" }
      );
      expect(result).toHaveLength(1);
    });

    it("should return cards without conditions when flags are inactive", () => {
      const result = cardsRestrictedByFlags(
        [{ card: "a card", weight: 1 } as Card],
        {}
      );
      expect(result).toHaveLength(1);
    });
  });
});

describe("isCardCooling", () => {
  it("returns false when no cards was proposed", () => {
    const cardIsCooling = isCardCooling([], {
      card: "foo",
    } as Card);

    expect(cardIsCooling).toBe(false);
  });

  it("returns true when card was proposed and no cooldown", () => {
    const cardIsCooling = isCardCooling([{ card: "foo" } as Card], {
      card: "foo",
    } as Card);

    expect(cardIsCooling).toBe(true);
  });

  it("returns false when card was just played and cooldown is 0", () => {
    const cardIsCooling = isCardCooling(
      [{ card: "foo", cooldown: 0 } as Card],
      {
        card: "foo",
      } as Card
    );

    expect(cardIsCooling).toBe(false);
  });

  it("returns true when card was just played and cooldown is 1", () => {
    const cardIsCooling = isCardCooling(
      [{ card: "foo", cooldown: 1 } as Card],
      {
        card: "foo",
      } as Card
    );

    expect(cardIsCooling).toBe(true);
  });

  it("returns false when card was previously played and cooldown is 1", () => {
    const cardIsCooling = isCardCooling(
      [
        { card: "bar", cooldown: 1 } as Card,
        { card: "foo", cooldown: 1 } as Card,
      ],
      {
        card: "foo",
      } as Card
    );

    expect(cardIsCooling).toBe(false);
  });
});

describe("removeCoolingCards", () => {
  it("returns original cards array for first round", () => {
    const cards = [
      { card: "card1", cooldown: 1 } as Card,
      { card: "card2" } as Card,
    ];

    const filteredCards = removeCoolingCards(cards, []);

    expect(filteredCards).toEqual(cards);
  });

  it("removes cards where isCardCooling function returns true", () => {
    const cards = [
      { card: "card1", cooldown: 1 } as Card,
      { card: "card2" } as Card,
      { card: "card3" } as Card,
      { card: "card4" } as Card,
    ];

    jest
      .spyOn(selectNextCard, "isCardCooling")
      .mockImplementation(
        (_, card: Card) => card.card === "card2" || card.card === "card3"
      );
    const filteredCards = removeCoolingCards(cards, [
      { card: "hotcards" } as Card,
    ]);

    expect(filteredCards).toEqual([cards[0], cards[3]]);
  });
});
