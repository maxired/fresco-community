import { Countdown } from "../../Countdown";
import { getSdk } from "../../sdk";
import { mockSdk } from "../../mocks";
import { Answer, persistParticipantVote } from "./persistence";
import { triggerEventOnParticipantVote } from "./triggerEventOnParticipantVote";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";
import { VotingState } from "./votingSlice";

const createState = (
  allVotes: {
    [participantId: string]: Answer | null;
  } = {},
  countdown = new Countdown(null)
): VotingState => ({
  countdown: countdown.value,
  answer: null,
  allVotes,
  noProgress: 0,
  noVotesMissing: 0,
  yesProgress: 0,
  yesVotesMissing:0
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
      // teleport is triggered on countdown lock
      new Countdown().lock()
    );

    persistParticipantVote("participant-1", null);
    triggerEventOnParticipantVote(state);

    expect(triggerEventSpy).not.toHaveBeenCalled();
  });
});
