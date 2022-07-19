import { createSlice } from "@reduxjs/toolkit";

export interface TransitioningState {
    round: boolean;
    question: boolean;
    answer: boolean;
}

export const transitionSlice = createSlice({
  name: "transition",
  initialState: {
    question: false,
    answer: false,
    round: false
  } as TransitioningState,
  reducers: {
    startQuestionAndAnswersTransition: (prevState) => ({
        ...prevState,
        question: true,
        answer: true
    }),
    endQuestionAndAnswersTransition: (prevState) => ({
      ...prevState,
        question: false,
        answer: false
    }),
    startRoundTransition: (prevState) => ({ ...prevState, round: true }),
    endRoundTransition: (prevState) => ({ ...prevState, round: false }),
    
  },
});

export const {
  reducer: transitionReducer,
  actions: { startQuestionAndAnswersTransition, endQuestionAndAnswersTransition, startRoundTransition, endRoundTransition },
} = transitionSlice;
