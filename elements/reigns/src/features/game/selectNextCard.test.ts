import { cardsDistributedByWeight } from "./selectNextCard";
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
});
