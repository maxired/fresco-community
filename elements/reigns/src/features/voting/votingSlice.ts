import { createSlice } from "@reduxjs/toolkit";
import { getSdk } from "../../sdk";
import { GAME_TABLE } from "../game/Game";
import { getParticipantVotes } from "./participantVotes";

export type GameVote = { answer: Answer | null; countdown: number | null };
export type VotingState = GameVote & {
  allVotes: { [participantId: string]: Answer | null };
};

export const ROUND_RESOLUTION_KEY = "round-resolution";

export type Answer = "Yes" | "No";

export const getLatestGameVote = () => {
  const result = (getSdk().storage.realtime.get(
    GAME_TABLE,
    ROUND_RESOLUTION_KEY
  ) ?? {}) as VotingState;
  return result;
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
      const gameVote = getLatestGameVote();
      if (gameVote) {
        state.answer = gameVote.answer;
        state.countdown = gameVote.countdown;
      } else {
        state.answer = null;
        state.countdown = null;
      }
      // TODO: implement this
    },
  },
});

export const {
  reducer,
  actions: { updateVote },
} = votingSlice;
