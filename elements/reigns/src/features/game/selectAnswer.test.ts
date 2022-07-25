import {
  GamePhase,
  VICTORY_FLAG_NAME,
  VICTORY_FLAG_VALUE,
} from "../../constants";
import { Game } from "./Game";
import { mockSdk } from "../../mocks";
import {
  createCard,
  createGameDefinition,
  createGameState,
} from "./objectMother";
import { setFlags } from "./selectAnswer";
import { GameDefinition } from "./types";

describe("selectAnswer", () => {
  beforeEach(() => {
    mockSdk();
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
  it("should set round to 1 at start", () => {
    const result = new Game()
      .startGame(createGameState(undefined, { round: 234234 }))
      .retrieve();
    expect(result.round).toBe(1);
  });
  it("should increment round on yes", () => {
    const result = new Game()
      .answerYes(createGameState(undefined, { round: 1 }))
      .retrieve();
    expect(result.round).toBe(2);
  });
  it("should increment round on no", () => {
    const result = new Game()
      .answerNo(createGameState(undefined, { round: 1 }))
      .retrieve();
    expect(result.round).toBe(2);
  });
  describe("game end", () => {
    const chooseAnswerThatEndsGame = () => {
      const result = new Game()
        .answerYes(
          createGameState(undefined, {
            flags: {
              foo: "bar",
            },
            selectedCard: createCard({
              yes_stat1: -1,
            }),
            stats: [1],
            phase: GamePhase.STARTED,
          })
        )
        .retrieve();
      return result;
    };

    const chooseAnswerThatSetVictoryFlags = (value = VICTORY_FLAG_VALUE) => {
      const result = new Game()
        .answerYes(
          createGameState(undefined, {
            selectedCard: createCard({
              yes_stat1: 0,
            }),
            stats: [1],
            phase: GamePhase.STARTED,
            flags: { [VICTORY_FLAG_NAME]: value },
          })
        )
        .retrieve();
      return result;
    };

    it("should end game if a card reduces a stat to zero", () => {
      const result = chooseAnswerThatEndsGame();
      expect(result.phase).toBe(GamePhase.ENDED);
    });
    it("should not clear flags", () => {
      const result = chooseAnswerThatEndsGame();
      expect(result.flags).toStrictEqual({ foo: "bar" });
    });
    it("should clear selected card", () => {
      const result = chooseAnswerThatEndsGame();
      expect(result.selectedCard).toBe(null);
    });
    it("should not end game if a stat is already zero and not updated by a card", () => {
      const result = new Game()
        .answerYes(
          createGameState(undefined, {
            selectedCard: createCard({
              yes_stat1: -1,
              yes_stat2: 0,
            }),
            stats: [4, 0],
            phase: GamePhase.STARTED,
          })
        )
        .retrieve();
      expect(result.phase).toBe(GamePhase.STARTED);
    });

    it("should end game if a card condition sets victory flag to true", () => {
      const result = chooseAnswerThatSetVictoryFlags();
      expect(result.phase).toBe(GamePhase.ENDED);
    });

    it("should reset flags if a card condition sets victory flag to true", () => {
      const result = chooseAnswerThatSetVictoryFlags();
      expect(result.flags).toStrictEqual({ win: "true" });
    });

    it("should not end game if a card condition sets victory flag to false", () => {
      const result = chooseAnswerThatSetVictoryFlags("false");
      expect(result.phase).toBe(GamePhase.STARTED);
    });

    describe("when victoryRoundThreshold is defined", () => {
      it("should end game when round reach victory threshold", () => {
        const result = new Game()
          .answerYes(
            createGameState(
              createGameDefinition({ victoryRoundThreshold: 10 }),
              {
                selectedCard: createCard({
                  yes_stat1: 0,
                }),
                stats: [1],
                phase: GamePhase.STARTED,
                round: 9,
              }
            )
          )
          .retrieve();

        expect(result.phase).toBe(GamePhase.ENDED);
      });

      it("should set win flag when round reach victory threshold", () => {
        const result = new Game()
          .answerYes(
            createGameState(
              createGameDefinition({ victoryRoundThreshold: 10 }),
              {
                selectedCard: createCard({
                  yes_stat1: 0,
                }),
                stats: [1],
                phase: GamePhase.STARTED,
                round: 9,
              }
            )
          )
          .retrieve();

        expect(result.flags[VICTORY_FLAG_NAME]).toBe(VICTORY_FLAG_VALUE);
      });

      it("should not end game when round does not reach victory threshold", () => {
        const result = new Game()
          .answerYes(
            createGameState(
              createGameDefinition({ victoryRoundThreshold: 10 }),
              {
                selectedCard: createCard({
                  yes_stat1: 0,
                }),
                stats: [1],
                phase: GamePhase.STARTED,
                round: 8,
              }
            )
          )
          .retrieve();

        expect(result.phase).toBe(GamePhase.STARTED);
      });

      it("should not set win flag when round does not reach victory threshold", () => {
        const result = new Game()
          .answerYes(
            createGameState(
              createGameDefinition({ victoryRoundThreshold: 10 }),
              {
                selectedCard: createCard({
                  yes_stat1: 0,
                }),
                stats: [1],
                phase: GamePhase.STARTED,
                round: 8,
              }
            )
          )
          .retrieve();

        expect(result.flags[VICTORY_FLAG_NAME]).toBe(undefined);
      });

      it("should not set win flag when losing on last day", () => {
        const result = new Game()
          .answerYes(
            createGameState(
              createGameDefinition({ victoryRoundThreshold: 10 }),
              {
                selectedCard: createCard({
                  yes_stat1: -10,
                }),
                stats: [1],
                phase: GamePhase.STARTED,
                round: 9,
              }
            )
          )
          .retrieve();

        expect(result.flags[VICTORY_FLAG_NAME]).toBe(undefined);
      });

      it("should end game when losing on last day", () => {
        const result = new Game()
          .answerYes(
            createGameState(
              createGameDefinition({ victoryRoundThreshold: 10 }),
              {
                selectedCard: createCard({
                  yes_stat1: -10,
                }),
                stats: [1],
                phase: GamePhase.STARTED,
                round: 9,
              }
            )
          )
          .retrieve();

        expect(result.phase).toBe(GamePhase.ENDED);
      });
    });
  });
});
