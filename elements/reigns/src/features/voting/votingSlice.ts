import { createSlice } from "@reduxjs/toolkit";
import { Answer, GameVote, getGameVote } from "./persistence";
import { triggerEventOnParticipantVote } from "./triggerEventOnParticipantVote";

export type VotingState = GameVote & {
  allVotes: { [participantId: string]: Answer | null };
};

export const votingSlice = createSlice({
  name: "voting",
  initialState: {
    countdown: null,
    answer: null,
    allVotes: {},
  } as VotingState,
  reducers: {
    updateVote: (state: VotingState) => {
      const gameVote = getGameVote();
      if (gameVote) {
        state.answer = gameVote.answer;
        state.countdown = gameVote.countdown;
      } else {
        state.answer = null;
        state.countdown = null;
      }

      triggerEventOnParticipantVote(state);
    },
  },
});

export const {
  reducer,
  actions: { updateVote },
} = votingSlice;
