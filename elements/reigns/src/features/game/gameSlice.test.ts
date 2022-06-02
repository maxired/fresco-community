import { GamePhase, Loading } from "../../constants";
import { Game } from "./Game";
import { gameReducer, initializeGame } from "./gameSlice";
import { mockSdk } from "./mocks";
import {
  createCard,
  createGameDefinition,
  createGameState,
} from "./objectMother";
import { Card, GameDefinition, GameState } from "./types";

describe("gameSlice", () => {
  beforeEach(() => {
    mockSdk();
  });
  describe("gameReducer", () => {
    describe("startGame", () => {
      it("should select a card", () => {
        const result = new Game()
          .startGame(
            createGameState(
              createGameDefinition({
                cards: [createCard({ card: "another card" })],
              })
            )
          )
          .retrieve();
        expect(result.selectedCard?.card).toBe("another card");
      });
    });
    describe("answerYes", () => {
      it("should select a card", () => {
        const result = new Game()
          .answerYes(
            createGameState(
              createGameDefinition({
                cards: [createCard({ card: "another card" })],
              })
            )
          )
          .retrieve();
        expect(result.selectedCard?.card).toBe("another card");
      });
    });
    describe("answerNo", () => {
      it("should select a card", () => {
        const result = new Game()
          .answerNo(
            createGameState(
              createGameDefinition({
                cards: [createCard({ card: "another card" })],
              })
            )
          )
          .retrieve();
        expect(result.selectedCard?.card).toBe("another card");
      });
    });

    describe("initialize", () => {
      it("should enter error state if validation fails", () => {
        const result = gameReducer(
          {} as GameState,
          initializeGame.fulfilled(createGameDefinition({ cards: [] }), "", "")
        );
        expect(result.loading).toBe(Loading.Error);
      });
      it("should not set NOT_STARTED if already started", () => {
        const result = gameReducer(
          {
            phase: GamePhase.STARTED,
          } as GameState,
          initializeGame.fulfilled(createGameState().definition, "", "")
        );
        expect(result.phase).toBe(GamePhase.STARTED);
      });
    });
  });

  describe("conditions", () => {
    it("can step through conditions", () => {
      const card1 = createCard({
        conditions: "dragon_killed==false",
        card: "Kill the dragon?",
        yes_custom: "dragon_killed=true",
      });

      const card2 = createCard({
        conditions: "dragon_killed==true",
        card: "Have a feast?",
      });

      const gameState = createGameState(
        createGameDefinition({
          cards: [card1, card2],
          deathMessage: "You died",
          assetsUrl: "test",
          stats: [{ value: 0, icon: "icon" }],
        })
      );

      const turn1 = new Game().startGame(gameState).retrieve();
      expect(turn1.selectedCard?.card).toBe("Kill the dragon?");

      const turn2 = new Game().answerNo({ ...gameState, ...turn1 }).retrieve();
      expect(turn2.selectedCard?.card).toBe("Kill the dragon?");

      const turn3 = new Game().answerYes({ ...gameState, ...turn1 }).retrieve();
      expect(turn3.selectedCard?.card).toBe("Have a feast?");
    });
  });
});
