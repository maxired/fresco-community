import { answerNo, answerYes, gameReducer, initialState, startGame } from "./gameSlice";
import { Card, GameDefinition, GameState } from "./types";

describe("gameReducer", () => {
  const state: GameState = {
    ...initialState,
    definition: {
      cards: [{ card: "a card" } as Card],
      stats: [{ value: 0, icon: "icon" }],
    } as GameDefinition,
  };
  describe("startGame", () => {
    it("should select next card", () => {
      const result = gameReducer(state, startGame());
      expect(result.selectedCard).not.toBeNull();
    });
  });
  describe("answerYes", () => {
    it("should select next card", () => {
      const result = gameReducer(state, answerYes());
      expect(result.selectedCard).not.toBeNull();
    });
  });
  describe("answerNo", () => {
    it("should select next card", () => {
      const result = gameReducer(state, answerNo());
      expect(result.selectedCard).not.toBeNull();
    });
  });
});
