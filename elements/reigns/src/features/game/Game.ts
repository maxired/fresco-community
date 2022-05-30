import { GamePhase } from "../../constants";
import { getSdk } from "../../sdk";
import { selectAnswer } from "./selectAnswer";
import { selectNextCard } from "./selectNextCard";
import { GameState, PersistedGameState, Stat } from "./types";

export const GAME_TABLE = "game";
export const GAME_STATE_KEY = "state";

export class Game {
  retrieve(): PersistedGameState {
    return getSdk().storage.realtime.get(
      GAME_TABLE,
      GAME_STATE_KEY
    ) as PersistedGameState;
  }

  private persist(state: PersistedGameState) {
    const sdk = getSdk();
    sdk.storage.realtime.set(GAME_TABLE, GAME_STATE_KEY, state);
  }

  startGame(state: GameState) {
    this.persist({
      phase: GamePhase.STARTED,
      selectedCard: selectNextCard(state.definition, state.flags),
      stats: state.definition
        ? state.definition.stats.map(({ value }) => value)
        : [],
      round: state.round + 1,
      flags: {},
    });
    return this;
  }

  answerNo(state: GameState) {
    if (state.selectedCard) {
      this.persist(selectAnswer(state, "no_custom"));
    }
    return this;
  }

  answerYes(state: GameState) {
    if (state.selectedCard) {
      this.persist(selectAnswer(state, "yes_custom"));
    }
    return this;
  }
}
