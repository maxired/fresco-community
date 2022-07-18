import { createSlice } from "@reduxjs/toolkit";

export interface FadeState {
    question: boolean;
    answer: boolean;
}

export const fadeSlice = createSlice({
  name: "fade",
  initialState: {
    question: false,
    answer: false
  } as FadeState,
  reducers: {
    fadeQuestionAndAnswers: () => ({
        question: true,
        answer: true
    }),
    showQuestionAndAnswers: () => ({
        question: false,
        answer: false
    })
  },
});

export const {
  reducer: fadeReducer,
  actions: { fadeQuestionAndAnswers, showQuestionAndAnswers },
} = fadeSlice;
