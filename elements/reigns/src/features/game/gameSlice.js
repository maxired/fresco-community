import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LOADING, ERROR, NOT_STARTED, STARTED, ENDED } from '../../constants';

export const initializeGame = createAsyncThunk(
  'game/initializeGame',
  async (gameUrl, thunkAPI) => {
    const response = await fetch(gameUrl);
    console.log('GAME', 'response', response);

    const json = await response.json();
    console.log('GAME', 'json', json);

    return json;
  }
);

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
    phase: LOADING,
    selectedCard: null,
    stats: [],
    gameUrl: null,
    definition: null,
  },
  reducers: {
    updateGame: (state, action) => {
      state.phase = action.payload.phase;
      state.selectedCard = action.payload.selectedCard;
      state.stats = action.payload.stats;
      state.gameUrl = action.payload.gameUrl;
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
  extraReducers(builder) {
    builder
      .addCase(initializeGame.pending, (state, action) => {
        state.phase = LOADING;
        console.log('GAME', 'loading');
      })
      .addCase(initializeGame.fulfilled, (state, action) => {
        state.phase = NOT_STARTED;
        state.definition = action.payload;

        console.log('GAME', 'action.payload', action.payload);
      })
      .addCase(initializeGame.rejected, (state, action) => {
        state.phase = ERROR;
        console.log('GAME', 'failed', action);
      })
  }
})

export const { updateGame, startGame, answerNo, answerYes } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;