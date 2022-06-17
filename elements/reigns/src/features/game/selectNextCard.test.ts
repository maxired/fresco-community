import * as selectNextCard from "./selectNextCard";

import { Card } from "./types";

const {
  cardsDistributedByWeight,
  cardsRestrictedByFlags,
  filterHotCardFactory,
  filterHotCards,
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

describe("filterHotCardFactory", () => {
  it("returns a function", () => {
    const filterHotCard = filterHotCardFactory([]);
    expect(typeof filterHotCard).toBe("function");
  });

  describe("returned function", () => {
    it("returns true when no hot cards", () => {
      const shouldFilterHotCard = filterHotCardFactory([])({
        card: "foo",
      } as Card);

      expect(shouldFilterHotCard).toBe(true);
    });

    it("returns false when card was played and no cooldown", () => {
      const shouldFilterHotCard = filterHotCardFactory([
        { card: "foo" } as Card,
      ])({
        card: "foo",
      } as Card);

      expect(shouldFilterHotCard).toBe(false);
    });

    it("returns true when card was just played and cooldown is 0", () => {
      const shouldFilterHotCard = filterHotCardFactory([
        { card: "foo", cooldown: 0 } as Card,
      ])({
        card: "foo",
      } as Card);

      expect(shouldFilterHotCard).toBe(true);
    });

    it("returns false when card was just played and cooldown is 1", () => {
      const shouldFilterHotCard = filterHotCardFactory([
        { card: "foo", cooldown: 1 } as Card,
      ])({
        card: "foo",
      } as Card);

      expect(shouldFilterHotCard).toBe(false);
    });

    it("returns true when card was previously played and cooldown is 1", () => {
      const shouldFilterHotCard = filterHotCardFactory([
        { card: "bar", cooldown: 1 } as Card,
        { card: "foo", cooldown: 1 } as Card,
      ])({
        card: "foo",
      } as Card);

      expect(shouldFilterHotCard).toBe(true);
    });
  });
});

describe("filterHotCards", () => {
  it("returns original cards array for first round", () => {
    const cards = [
      { card: "card1", cooldown: 1 } as Card,
      { card: "card2" } as Card,
    ];

    const filteredCards = filterHotCards(cards, []);

    expect(filteredCards).toEqual(cards);
  });

  it("removes cards where filterHotCardFactory function returns false", () => {
    const cards = [
      { card: "card1", cooldown: 1 } as Card,
      { card: "card2" } as Card,
      { card: "card3" } as Card,
      { card: "card4" } as Card,
    ];

    jest
      .spyOn(selectNextCard, "filterHotCardFactory")
      .mockImplementationOnce(
        () => (card: Card) => card.card === "card1" || card.card === "card4"
      );
    const filteredCards = filterHotCards(cards, [{ card: "hotcards" } as Card]);

    expect(filteredCards).toEqual([cards[0], cards[3]]);
  });
});
