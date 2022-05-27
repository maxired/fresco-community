import { GamePhase } from "../../constants";
import { selectAnswer, setFlags } from "./selectAnswer";
import { Card, GameDefinition, PersistedGameState } from "./types";

const createCard = (): Card => ({
  card: "my card",
  bearer: "some text",
  weight: 0,
  answer_yes: "Yes!",
  yes_stat1: 0,
  yes_stat2: 0,
  yes_stat3: 0,
  yes_stat4: 0,
  yes_custom: "",
  answer_no: "No!",
  no_stat1: 0,
  no_stat2: 0,
  no_stat3: 0,
  no_stat4: 0,
  no_custom: "",
  conditions: "",
});

const createGameDefinition = (): GameDefinition => ({
  cards: [createCard()],
  stats: [
    {
      icon: "some icon",
      value: 5,
    },
  ],
  assetsUrl: "whatever",
  deathMessage: "You died",
});

const createGameState = (): PersistedGameState => ({
  round: 0,
  flags: {},
  phase: GamePhase.STARTED,
  selectedCard: {},
});

describe("selectAnswer", () => {
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
  it("should increment round", () => {});
});
