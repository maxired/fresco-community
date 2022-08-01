import { mockSdk } from "../../mocks";
import { getSdk } from "../../sdk";
import { persistParticipantVote, getParticipantVotes } from "./persistence";

describe("persistence", () => {
  beforeEach(() => {
    mockSdk();
  });
  describe("persistParticipantVote", () => {
    it("should set vote", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      expect(getParticipantVotes()).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: getSdk().localParticipant.id,
            answer: "Yes",
          }),
        ])
      );
    });

    it("should remove vote", () => {
      persistParticipantVote(getSdk().localParticipant.id, "Yes");
      persistParticipantVote(getSdk().localParticipant.id, null);
      expect(getParticipantVotes()).not.toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: getSdk().localParticipant.id,
            answer: "Yes",
          }),
        ])
      );
    });
  });
});
