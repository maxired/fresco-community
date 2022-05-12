import { GamePhase } from "../../constants";
import {
  answerNo,
  answerYes,
  gameReducer,
  initializeGame,
  initialState,
  startGame,
} from "./gameSlice";
import { Card, GameDefinition, GameState } from "./types";

const getState = (cards?: Card[])  => ({
    ...initialState,
    selectedCard: { card: "a card"},
    definition: {
      cards: cards || [{ card: "another card", weight: 1 } as Card],
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

  describe("initialize", () => {
    it("should enter error state if validation fails", () => {
      const result = gameReducer(
        {} as GameState,
        initializeGame.fulfilled(getState([]).definition, "", "")
      );
      expect(result.phase).toBe(GamePhase.ERROR);
    });
  });
});
