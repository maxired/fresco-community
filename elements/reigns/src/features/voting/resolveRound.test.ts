import { getSdk } from "../../sdk";
import { mockSdk } from "../game/mocks";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";
import { COUNTDOWN_SECONDS, resolveRound } from "./resolveRound";
import { createGameState } from "../game/objectMother";
import {
  getGameVote,
  PARTICIPANT_VOTE_TABLE,
  persistGameVote,
  persistParticipantVote,
} from "./persistence";

describe("useCollateVotes", () => {
  let sdk: IFrescoSdk;
  beforeEach(() => {
    mockSdk({
      remoteParticipants: [
        { id: "remote1", name: "remote participant 1" } as Participant,
        { id: "remote2", name: "remote participant 2" } as Participant,
      ],
    });
    sdk = getSdk();
    // put participants inside the element
    [sdk.localParticipant.id, "remote1", "remote2"].forEach((id) => {
      sdk.storage.realtime.set(PARTICIPANT_INSIDE_TABLE, id, true);
    });
  });

  describe("majority achieved", () => {
    it("should apply vote instantly if everyone voted ", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      persistParticipantVote("remote2", "No");

      resolveRound(createGameState());

      const { answer, countdown } = getGameVote();
      expect(answer).toBe("Yes");
      expect(countdown).toBe(0);
    });

    it("should start countdown if not everyone voted", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      persistParticipantVote("remote2", null);

      resolveRound(createGameState());

      const { answer, countdown } = getGameVote();
      expect(answer).toBe("Yes");
      expect(countdown).toBe(COUNTDOWN_SECONDS);
    });

    it("should apply vote instantly if everyone voted and countdown already started", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      persistParticipantVote("remote2", null);

      resolveRound(createGameState());
      persistParticipantVote("remote2", "Yes");
      resolveRound(createGameState());

      const { answer, countdown } = getGameVote();
      expect(answer).toBe("Yes");
      expect(countdown).toBe(0);
    });

    it("should clear participant votes on countdown === 0", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      persistParticipantVote("remote2", "No");

      resolveRound(createGameState());

      const { countdown } = getGameVote();
      expect(countdown).toBe(0);
      expect(sdk.storage.realtime.all(PARTICIPANT_VOTE_TABLE)).toEqual({});
    });

    it("should stop countdown if majority lost", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      persistParticipantVote("remote2", null);

      resolveRound(createGameState());
      const { countdown } = getGameVote();
      expect(countdown).toBe(COUNTDOWN_SECONDS);
      persistParticipantVote("remote1", null);
      resolveRound(createGameState());

      const { countdown: newCountdown } = getGameVote();
      expect(newCountdown).toBeUndefined();
    });

    it("should force reset if countdown gets too low", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      persistParticipantVote("remote2", null);

      persistGameVote({ answer: "Yes", countdown: -43 });
      resolveRound(createGameState());
      const { answer, countdown } = getGameVote();
      expect(answer).toBeUndefined();
      expect(countdown).toBeUndefined();
    });
  });
});
