import { answerNo, answerYes, gameReducer, initialState, startGame } from "./gameSlice";
import { Card, GameDefinition, GameState } from "./types";

const getState = ()  => ({
    ...initialState,
    selectedCard: { card: "a card"},
    definition: {
      cards: [{ card: "another card", weight: 1 } as Card],
      stats: [{ value: 0, icon: "icon" }],
    } as GameDefinition,
  } as GameState
);

describe("gameReducer", () => {
  describe("startGame", () => {
    it("should select a card", () => {
      const result = gameReducer(getState(), startGame());
      expect(result.selectedCard?.card).toBe("another card")
    });
  });
  describe("answerYes", () => {
    it("should select a card", () => {
      const result = gameReducer(getState(), answerYes());
      expect(result.selectedCard?.card).toBe("another card")
    });
  });
  describe("answerNo", () => {
    it("should select a card", () => {
      const result = gameReducer(getState(), answerNo());
      expect(result.selectedCard?.card).toBe("another card")
    });
  });
});
