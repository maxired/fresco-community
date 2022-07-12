import { getSdk } from "../../sdk";
import { mockSdk } from "../../mocks";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";
import { resolveRound } from "./resolveRound";
import { createGameState } from "../game/objectMother";
import * as persistence from "./persistence";
const {
  persistParticipantVote,
  getGameVote,
  persistGameVote,
  PARTICIPANT_VOTE_TABLE,
} = persistence;
import { Countdown } from "../../Countdown";
import * as selectNextCard from "../game/selectNextCard";

describe("resolveRound", () => {
  let sdk: IFrescoSdk;
  beforeEach(() => {
    jest.clearAllMocks();
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
      expect(Countdown.from(countdown).wasJustLocked).toBe(true);
    });

    it("should start countdown if not everyone voted", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      persistParticipantVote("remote2", null);

      resolveRound(createGameState());

      const { answer, countdown } = getGameVote();
      expect(answer).toBe("Yes");
      expect(Countdown.from(countdown).isStarted).toBe(true);
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
      expect(Countdown.from(countdown).wasJustLocked).toBe(true);
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
      expect(Countdown.from(countdown).isStarted).toBe(true);
      persistParticipantVote("remote1", null);
      resolveRound(createGameState());

      const { countdown: newCountdown } = getGameVote();
      expect(Countdown.from(newCountdown).isStarted).toBe(false);
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

    it("should select a new card once at end of round", () => {
      const spy = jest.spyOn(selectNextCard, "selectNextCard");

      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      persistParticipantVote("remote2", "Yes");
      persistGameVote({ answer: "Yes", countdown: 1 });

      resolveRound(createGameState()); //  0
      resolveRound(createGameState()); // -1
      resolveRound(createGameState()); // -2

      expect(spy).toBeCalledTimes(1);
    });

    it("should clear participant votes once per round", () => {
      const spy = jest.spyOn(persistence, "clearParticipantVotes");

      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      persistParticipantVote("remote2", "Yes");
      persistGameVote({ answer: "Yes", countdown: 1 });

      resolveRound(createGameState()); //  0
      resolveRound(createGameState()); // -1
      resolveRound(createGameState()); // -2

      expect(spy).toBeCalledTimes(1);
    });
  });
});
