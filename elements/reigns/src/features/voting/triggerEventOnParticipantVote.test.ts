import { getSdk } from "../../sdk";
import { mockSdk } from "../game/mocks";
import { persistParticipantVote } from "./participantVotes";
import { triggerEventOnParticipantVote } from "./triggerEventOnParticipantVote";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";
import { Answer, VotingState } from "./votingSlice";

const createState = (
  allVotes: {
    [participantId: string]: Answer | null;
  } = {},
  countdown: number | null = null
): VotingState => ({
  countdown,
  answer: null,
  allVotes,
});

describe("votingSlice", () => {
  const triggerEventSpy = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
    mockSdk({
      triggerEvent: triggerEventSpy,
      remoteParticipants: [
        { id: "participant-1", name: "Mara Jade" } as Participant,
      ],
    });
    const sdk = getSdk();
    // put participants inside the element
    ["participant-1"].forEach((id) => {
      sdk.storage.realtime.set(PARTICIPANT_INSIDE_TABLE, id, true);
    });
  });
  it("should play sound when vote added for participant", () => {
    const state = createState({
      "participant-1": null,
    });

    persistParticipantVote("participant-1", "Yes");
    triggerEventOnParticipantVote(state);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ eventName: "custom.reigns.voteAdded" })
    );
  });
  it("should play sound when vote removed for participant", () => {
    const state = createState({
      "participant-1": "Yes",
    });

    persistParticipantVote("participant-1", null);
    triggerEventOnParticipantVote(state);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ eventName: "custom.reigns.voteRemoved" })
    );
  });
  it("should not play a sound if nothing changed", () => {
    const state = createState({
      "participant-1": "Yes",
    });

    persistParticipantVote("participant-1", "Yes");
    triggerEventOnParticipantVote(state);

    expect(triggerEventSpy).not.toHaveBeenCalled();
  });

  it("should not play a sound when teleporting", () => {
    const state = createState(
      {
        "participant-1": "Yes",
      },
      0
    );

    persistParticipantVote("participant-1", null);
    triggerEventOnParticipantVote(state);

    expect(triggerEventSpy).not.toHaveBeenCalled();
  });
});
