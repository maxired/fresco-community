import { createSlice } from "@reduxjs/toolkit";
import { getSdk } from "../../sdk";
import { GAME_TABLE } from "../game/Game";

export type VotingState = {
  answer: Answer | null;
  countdown: number | null;
};

export const ROUND_RESOLUTION_KEY = "round-resolution";

export type Answer = "Yes" | "No";

export const getLatestVote = () => {
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
  },
  reducers: {
    updateVote: (state: VotingState) => {
      const result = getLatestVote();
      if (result) {
        state.answer = result.answer;
        state.countdown = result.countdown;
      } else {
        state.answer = null;
        state.countdown = null;
      }
    },
  },
});

export const {
  reducer,
  actions: { updateVote },
} = votingSlice;
