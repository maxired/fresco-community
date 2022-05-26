import { createSlice } from "@reduxjs/toolkit";
import { getSdk } from "../../sdk";
import { GAME_TABLE } from "../host/determineHost";

type VotingState = {
  answer: Answer | null;
  countdown: number | null;
};

export const ANSWER_KEY = "answer-countdown";

export type Answer = "Yes" | "No";

export type AnswerCountdown = {
  answer: Answer;
  countdown: number;
};

export const votingSlice = createSlice({
  name: "voting",
  initialState: {
    answer: null,
    countdown: null,
  },
  reducers: {
    updateVote: (state: VotingState) => {
      const sdk = getSdk();
      const answerCountdown = sdk.storage.get(GAME_TABLE, ANSWER_KEY)
        ?.value as AnswerCountdown;
      if (answerCountdown) {
        state.answer = answerCountdown.answer;
        state.countdown = answerCountdown.countdown;
      } else {
        state.answer = null;
        state.countdown = null;
      }
      console.log("Current vote", state.answer, state.countdown);
    },
  },
});

export const {
  reducer,
  actions: { updateVote },
} = votingSlice;
