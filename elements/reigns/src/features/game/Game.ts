import { GamePhase } from "../../constants";
import { getSdk } from "../../sdk";
import {
  PARTICIPANT_VOTE_TABLE,
  ROUND_RESOLUTION_KEY,
} from "../voting/persistence";
import { selectAnswer } from "./selectAnswer";
import { selectNextCard } from "./selectNextCard";
import { GameState, PersistedGameState, Stat } from "./types";

export const GAME_TABLE = "game";
export const GAME_STATE_KEY = "state";

/**
 * Apart from `retrieve`, methods in this class should only ever
 * be called by the player who is currently the host
 */

export class Game {
  retrieve(): PersistedGameState {
    return getSdk().storage.realtime.get(
      GAME_TABLE,
      GAME_STATE_KEY
    ) as PersistedGameState;
  }

  private persist(state: PersistedGameState) {
    getSdk().storage.realtime.set(GAME_TABLE, GAME_STATE_KEY, state);
    if (state.phase === GamePhase.ENDED) {
      this.clearVotes();
    }
  }

  private clearVotes() {
    const sdk = getSdk();
    sdk.storage.realtime.set(GAME_TABLE, ROUND_RESOLUTION_KEY, undefined);
    sdk.storage.realtime.clear(PARTICIPANT_VOTE_TABLE);
    return this;
  }

  changeGame() {
    getSdk().storage.realtime.set(GAME_TABLE, GAME_STATE_KEY, undefined);
    this.clearVotes();
  }

  startGame(state: Pick<GameState, "definition" | "designerCards">) {
    this.clearVotes();
    const flags = {};
    const previouslySelectedCardIds = [] as string[];
    this.persist({
      phase: GamePhase.STARTED,
      selectedCard: selectNextCard(
        state.definition,
        flags,
        state.designerCards,
        previouslySelectedCardIds
      ),
      stats: state.definition
        ? state.definition.stats.map(({ value }) => value)
        : [],
      round: 1,
      flags,
      previouslySelectedCardIds,
    });
    return this;
  }

  answerNo(state: GameState) {
    if (state.selectedCard) {
      this.persist(selectAnswer(state, "no_custom"));
      getSdk().triggerEvent({
        eventName: "custom.reigns.answer",
        eventValue: JSON.stringify({
          cardId: state.selectedCard.id,
          card: state.selectedCard.card,
          voteValue: "no",
          voleLabel: state.selectedCard.answer_no,
          round: state.round,
        }),
      });
    }
    return this;
  }

  answerYes(state: GameState) {
    if (state.selectedCard) {
      this.persist(selectAnswer(state, "yes_custom"));

      getSdk().triggerEvent({
        eventName: "custom.reigns.answer",
        eventValue: JSON.stringify({
          cardId: state.selectedCard.id,
          card: state.selectedCard.card,
          voteValue: "yes",
          voleLabel: state.selectedCard.answer_yes,
          round: state.round,
        }),
      });
    }
    return this;
  }
}
