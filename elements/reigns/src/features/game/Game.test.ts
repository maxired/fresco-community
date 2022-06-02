import { GamePhase } from "../../constants";
import { getSdk } from "../../sdk";
import { persistAnswer } from "../voting/persistAnswer";
import {
  PARTICIPANT_VOTE_TABLE,
  persistParticipantVote,
} from "../voting/useVoteListener";
import { getLatestVote } from "../voting/votingSlice";
import { Game } from "./Game";
import { mockSdk } from "./mocks";
import { createCard, createGameState } from "./objectMother";

describe("Game", () => {
  beforeEach(() => {
    mockSdk();
  });
  describe("game over", () => {
    it("should clear participant votes", () => {
      persistAnswer({
        answer: "No",
        countdown: 3,
      });
      persistParticipantVote(getSdk().localParticipant.id, "Yes");

      const result = new Game()
        .answerNo(
          createGameState(undefined, {
            stats: [10],
            selectedCard: createCard({ no_stat1: -20 }),
          })
        )
        .retrieve();

      const answer = getLatestVote();
      expect(answer).toEqual({});

      expect(result.phase).toBe(GamePhase.ENDED);
      expect(getSdk().storage.realtime.all(PARTICIPANT_VOTE_TABLE)).toEqual({});
    });
    it("should clear round resolution", () => {});
  });
});
