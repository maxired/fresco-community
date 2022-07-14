import { getSdk } from "../../sdk";
import { mockSdk } from "../../mocks";
import { calculateAnswer } from "./calculateAnswer";
import { persistParticipantVote } from "./persistence";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";
import { createParticipant } from "../game/objectMother";

const remoteParticipant1 = createParticipant("remote1");
const remoteParticipant2 = createParticipant("remote2");

const mockSdkWithRemoteParticipants = (remoteParticipants: Participant[]) => {
  mockSdk({
    remoteParticipants,
  });
  const sdk = getSdk();
  // put participants inside the element
  [sdk.localParticipant.id, ...remoteParticipants.map((p) => p.id)].forEach(
    (id) => {
      sdk.storage.realtime.set(PARTICIPANT_INSIDE_TABLE, id, true);
    }
  );
};

describe("calculateAnswer", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  describe("answer", () => {
    beforeEach(() => {
      mockSdkWithRemoteParticipants([remoteParticipant1, remoteParticipant2]);
    });
    it("should return nothing if no one has answered", () => {
      const result = calculateAnswer();
      expect(result.answer).toBeNull();
      expect(result.everyoneVoted).toBe(false);
    });
    it("should choose answer if > 50% votes", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "Yes");
      const result = calculateAnswer();
      expect(result.answer).toBe("Yes");
      expect(result.everyoneVoted).toBe(false);
    });
    it("should not choose answer if < 50% votes", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      const result = calculateAnswer();
      expect(result.answer).toBeNull();
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
    it("should choose no answer in the case of tie", () => {
      getSdk().storage.realtime.set(PARTICIPANT_INSIDE_TABLE, "remote2", false);
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote("remote1", "No");
      const result = calculateAnswer();
      expect(result.answer).toBeNull();
      expect(result.everyoneVoted).toBe(true);
    });
  });
  describe("progress", () => {
    describe("one participant", () => {
      beforeEach(() => {
        mockSdkWithRemoteParticipants([]);
      });
      it("should return 0% when no votes", () => {
        const result = calculateAnswer();

        expect(result.yesProgress).toBe(0);
      });
      it("should return 100% when single vote", () => {
        persistParticipantVote(getSdk().localParticipant.id, "Yes");

        const result = calculateAnswer();

        expect(result.yesProgress).toBe(1);
      });
    });
    describe("two participants", () => {
      beforeEach(() => {
        mockSdkWithRemoteParticipants([remoteParticipant1]);
      });
      it("should return 50% when single vote", () => {
        persistParticipantVote(getSdk().localParticipant.id, "Yes");

        const result = calculateAnswer();

        expect(result.yesProgress).toBe(0.5);
      });
      it("should return 100% when two votes", () => {
        persistParticipantVote(getSdk().localParticipant.id, "Yes");
        persistParticipantVote(remoteParticipant1.id, "Yes");

        const result = calculateAnswer();

        expect(result.yesProgress).toBe(1);
      });
    });
    describe("three participants", () => {
      beforeEach(() => {
        mockSdkWithRemoteParticipants([remoteParticipant1, remoteParticipant2]);
      });
      it("should return 50% when single vote", () => {
        persistParticipantVote(getSdk().localParticipant.id, "Yes");

        const result = calculateAnswer();

        expect(result.yesProgress).toBe(0.5);
      });
      it("should return 100% when two votes", () => {
        persistParticipantVote(getSdk().localParticipant.id, "Yes");
        persistParticipantVote(remoteParticipant1.id, "Yes");

        const result = calculateAnswer();

        expect(result.yesProgress).toBe(1);
      });
    });
  });
});
