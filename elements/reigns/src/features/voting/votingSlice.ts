import { createSlice } from "@reduxjs/toolkit";
import { calculateAnswer, VoteProgress } from "./calculateAnswer";
import { Answer, GameVote, getGameVote } from "./persistence";
import { triggerEventOnParticipantVote } from "./triggerEventOnParticipantVote";

export type VotingState = GameVote &
  VoteProgress & {
    allVotes: { [participantId: string]: Answer | null };
  };

export const votingSlice = createSlice({
  name: "voting",
  initialState: {
    countdown: null,
    answer: null,
    allVotes: {},
    yesProgress: 0,
    noProgress: 0,
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

      const { yesProgress, noProgress, yesVotesMissing, noVotesMissing } =
        calculateAnswer();
      state.yesProgress = yesProgress;
      state.noProgress = noProgress;
      state.yesVotesMissing = yesVotesMissing;
      state.noVotesMissing = noVotesMissing;
    },
  },
});

export const {
  reducer,
  actions: { updateVote },
} = votingSlice;
