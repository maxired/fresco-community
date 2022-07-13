import { Countdown } from "../../Countdown";
import { getSdk } from "../../sdk";
import { getParticipantVotes } from "./persistence";
import { VotingState } from "./votingSlice";

export const triggerEventOnParticipantVote = (state: VotingState) => {
  const participantVotes = getParticipantVotes();
  let didAddVote = false;
  let didRemoveVote = false;
  participantVotes.forEach((vote) => {
    if (!state.allVotes[vote.id] && vote.answer) {
      state.allVotes[vote.id] = vote.answer;
      didAddVote = true;
    } else if (state.allVotes[vote.id] && !vote.answer) {
      delete state.allVotes[vote.id];
      didRemoveVote = true;
    }
  });

  const countdown = Countdown.from(state.countdown);

  if (!countdown.isLocked) {
    // space owners can configure actions for these events in fresco, for example playing sound
    if (didAddVote) {
      getSdk().triggerEvent({ eventName: "custom.reigns.voteAdded" });
    }
    if (didRemoveVote) {
      getSdk().triggerEvent({ eventName: "custom.reigns.voteRemoved" });
    }
  } else if (didAddVote) {
    // TODO: it's possible to reach this if the participant votes within one second of the countdown expiring
    console.log(`No voteAdded event, because already locked`);
  }
};
