import { GamePhase, Loading } from "../../constants";
import {
  answerNo,
  answerYes,
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

describe("gameSlice", () => {
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
        expect(result.loading).toBe(Loading.Error);
      });
      it("should not set NOT_STARTED if already started", () => {
        const result = gameReducer(
          {
            phase: GamePhase.STARTED,
          } as GameState,
          initializeGame.fulfilled(getState().definition, "", "")
        );
        expect(result.phase).toBe(GamePhase.STARTED);
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

  describe("conditions", () => {
    it("can step through conditions", () => {
      const card1 = {
        conditions: "dragon_killed==false",
        card: "Kill the dragon?",
        yes_custom: "dragon_killed=true",
        weight: 1,
      } as Card;

      const card2 = {
        conditions: "dragon_killed==true",
        card: "Have a feast?",
        weight: 1,
      } as Card;

      const gameState = {
        definition: {
          cards: [card1, card2],
          deathMessage: "You died",
          assetsUrl: "test",
          stats: [{ value: 0, icon: "icon" }],
        },
        flags: {},
      } as GameState;

      const turn1 = gameReducer(gameState, startGame());
      expect(turn1.selectedCard?.card).toBe("Kill the dragon?");

      const turn2 = gameReducer(turn1, answerNo());
      expect(turn2.selectedCard?.card).toBe("Kill the dragon?");

      const turn3 = gameReducer(turn2, answerYes());
      expect(turn3.selectedCard?.card).toBe("Have a feast?");
    });
  });
});
