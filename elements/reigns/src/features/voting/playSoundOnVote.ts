import { getSdk } from "../../sdk";
import { getParticipantVotes } from "./participantVotes";
import { VotingState } from "./votingSlice";

export const playSoundOnVote = (state: VotingState) => {
  const participantVotes = getParticipantVotes();
  let didMakeVote = false;
  let didRemoveVote = false;
  participantVotes.forEach((vote) => {
    if (!state.allVotes[vote.id] && vote.answer) {
      state.allVotes[vote.id] = vote.answer;
      didMakeVote = true;
    } else if (state.allVotes[vote.id] && !vote.answer) {
      delete state.allVotes[vote.id];
      didRemoveVote = true;
    }
  });

  const isTeleporting =
    typeof state.countdown === "number" && state.countdown < 1;

  if (!isTeleporting) {
    if (didMakeVote) {
      getSdk().triggerEvent({ eventName: "custom.reigns.voteAdded" });
    }
    if (didRemoveVote) {
      getSdk().triggerEvent({ eventName: "custom.reigns.voteRemoved" });
    }
  }
};
