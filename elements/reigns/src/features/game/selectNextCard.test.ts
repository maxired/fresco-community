import {
  cardsDistributedByWeight,
  cardsRestrictedByFlags,
} from "./selectNextCard";
import { Card } from "./types";

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

    it("should exclude cards affected by flag==false when game flag is not set", () => {
      const result = cardsRestrictedByFlags(
        [{ card: "a card", weight: 1, conditions: "flag==false" } as Card],
        {}
      );
      expect(result).toHaveLength(0);
    });

    it("should include cards unaffected by flags", () => {
      const result = cardsRestrictedByFlags(
        [{ card: "a card", weight: 1 } as Card],
        { flag: "true" }
      );
      expect(result).toHaveLength(1);
    });
  });
});
