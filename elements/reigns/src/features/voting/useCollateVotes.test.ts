import { getSdk } from "../../sdk";
import { mockSdk } from "../game/mocks";
import { calculateAnswer } from "./useCollateVotes";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";
import { persistParticipantVote } from "./useVoteListener";

describe("useCollateVotes", () => {
  describe("calculateAnswer", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      mockSdk({
        remoteParticipants: [
          { id: "remote1", name: "remote participant 1" } as Participant,
          { id: "remote2", name: "remote participant 2" } as Participant,
        ],
      });
      const sdk = getSdk();
      // put participants inside the element
      [sdk.localParticipant.id, "remote1", "remote2"].forEach((id) => {
        sdk.storage.realtime.set(PARTICIPANT_INSIDE_TABLE, id, true);
      });
    });
    it("should return nothing if no one has answered", () => {
      const result = calculateAnswer();
      expect(result.answer).toBeUndefined();
      expect(result.everyoneVoted).toBe(false);
    });
    it("should choose answer if majority reached", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      const result = calculateAnswer();
      expect(result.answer).toBe("Yes");
      expect(result.everyoneVoted).toBe(false);
    });
    it("should choose an answer once everyone has voted", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      persistParticipantVote("remote2", "Yes");
      const result = calculateAnswer();
      expect(result.answer).toBe("Yes");
      expect(result.everyoneVoted).toBe(true);
    });
    it("should exclude participants outside the element", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      // move remote participants outside element
      ["remote1", "remote2"].forEach((id) => {
        getSdk().storage.realtime.set(PARTICIPANT_INSIDE_TABLE, id, false);
      });
      const result = calculateAnswer();
      expect(result.answer).toBe("Yes");
      expect(result.everyoneVoted).toBe(true);
    });
    it("should return no answer in the case of tie", () => {
      getSdk().storage.realtime.set(PARTICIPANT_INSIDE_TABLE, "remote2", false);
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "No");
      const result = calculateAnswer();
      expect(result.answer).toBeUndefined();
      expect(result.everyoneVoted).toBe(true);
    });
  });
});
