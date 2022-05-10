import { createSlice } from '@reduxjs/toolkit'
import { NOT_STARTED, STARTED, ENDED } from '../../constants';

function setValue(statUpdate, stat, state) {
  if (!statUpdate) { return; }

  stat.value += statUpdate;
  stat.value = Math.min(100, Math.max(0, stat.value));
  if (stat.value === 0) {
    state.phase = ENDED;
  }
}

function getAllValidCards(state) {
  return state.definition.cards;
}

function selectNextCard(state) {
  const validCards = getAllValidCards(state);
  const randomCard = validCards[Math.floor(Math.random() * validCards.length)];
  console.log('New card selected', randomCard.card);
  return randomCard;
}


export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    phase: NOT_STARTED,
    selectedCard: null,
    stats: [],
    definition: null,
  },
  reducers: {
    initializeGame: (state, action) => {
      state.definition = action.payload;
    },
    updateGame: (state, action) => {
      state.phase = action.payload.phase;
      state.selectedCard = action.payload.selectedCard;
      state.stats = action.payload.stats;
    },
    startGame: (state) => {
      state.phase = STARTED;
      state.selectedCard = selectNextCard(state);
      state.stats = state.definition.stats.map((stat) => ({ ...stat }));
    },
    answerNo: (state) => {
      setValue(state.selectedCard.no_stat1, state.stats[0], state);
      setValue(state.selectedCard.no_stat2, state.stats[1], state);
      setValue(state.selectedCard.no_stat3, state.stats[2], state);
      setValue(state.selectedCard.no_stat4, state.stats[3], state);

      state.selectedCard = selectNextCard(state);

    },
    answerYes: (state) => {
      setValue(state.selectedCard.yes_stat1, state.stats[0], state);
      setValue(state.selectedCard.yes_stat2, state.stats[1], state);
      setValue(state.selectedCard.yes_stat3, state.stats[2], state);
      setValue(state.selectedCard.yes_stat4, state.stats[3], state);
      state.selectedCard = selectNextCard(state);
    }
  },
})

export const { initializeGame, updateGame, startGame, answerNo, answerYes } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;