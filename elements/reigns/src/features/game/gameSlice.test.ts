import { GamePhase } from "../../constants";
import {
  answerNo,
  answerYes,
  cardsDistributedByWeight,
  gameReducer,
  initializeGame,
  initialState,
  setFlags,
  startGame,
} from "./gameSlice";
import { Card, GameDefinition, GameState } from "./types";

const getState = (cards?: Card[]) =>
  ({
    ...initialState,
    selectedCard: { card: "a card" },
    definition: {
      cards: cards || [{ card: "another card", weight: 1 } as Card],
      stats: [{ value: 0, icon: "icon" }],
    } as GameDefinition,
  } as GameState);

describe("gameReducer", () => {
  describe("startGame", () => {
    it("should select a card", () => {
      const result = gameReducer(getState(), startGame());
      expect(result.selectedCard?.card).toBe("another card");
    });
  });
  describe("answerYes", () => {
    it("should select a card", () => {
      const result = gameReducer(getState(), answerYes());
      expect(result.selectedCard?.card).toBe("another card");
    });
  });
  describe("answerNo", () => {
    it("should select a card", () => {
      const result = gameReducer(getState(), answerNo());
      expect(result.selectedCard?.card).toBe("another card");
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

describe("setFlags", () => {
  it("should set multiple flags", () => {
    const flags = setFlags({}, [
      { key: "chapter3", value: "true" },
      { key: "queen_killed", value: "false" },
    ]);
    expect(flags.chapter3).toBe("true");
    expect(flags.queen_killed).toBe("false");
  });

  it("should leave existing flags", () => {
    const flags = setFlags({ chapter3: "true" }, [
      { key: "queen_killed", value: "false" },
    ]);
    expect(flags.chapter3).toBe("true");
  });
});
