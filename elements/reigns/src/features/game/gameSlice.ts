import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GamePhase } from "../../constants";
import { IGameState, IStat } from "./types";

export const initializeGame = createAsyncThunk(
  "game/initializeGame",
  async (gameUrl: string, thunkAPI) => {
    const response = await fetch(gameUrl);
    console.log("GAME", "response", response);

    const json = await response.json();
    console.log("GAME", "json", json);

    return json;
  }
);

function setValue(statUpdate: number, stat: IStat, state: IGameState) {
  if (!statUpdate) {
    return;
  }

  stat.value += statUpdate;
  stat.value = Math.min(100, Math.max(0, stat.value));
  if (stat.value === 0) {
    state.phase = GamePhase.ENDED;
  }
}

function getAllValidCards(state: IGameState) {
  return state.definition ? state.definition.cards : [];
}

function selectNextCard(state: IGameState) {
  const validCards = getAllValidCards(state);
  const randomCard = validCards[Math.floor(Math.random() * validCards.length)];
  console.log("New card selected", randomCard.card);
  return randomCard;
}

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    phase: GamePhase.LOADING,
    selectedCard: null,
    stats: [],
    gameUrl: null,
    definition: null,
  } as IGameState,
  reducers: {
    updateGame: (state, action) => {
      state.phase = action.payload.phase;
      state.selectedCard = action.payload.selectedCard;
      state.stats = action.payload.stats;
      state.gameUrl = action.payload.gameUrl;
    },
    startGame: (state: IGameState) => {
      state.phase = GamePhase.STARTED;
      state.selectedCard = selectNextCard(state);
      state.stats = state.definition
        ? state.definition.stats.map((stat: IStat) => ({ ...stat }))
        : [];
    },
    answerNo: (state: IGameState) => {
      if (state.selectedCard) {
        setValue(state.selectedCard.no_stat1, state.stats[0], state);
        setValue(state.selectedCard.no_stat2, state.stats[1], state);
        setValue(state.selectedCard.no_stat3, state.stats[2], state);
        setValue(state.selectedCard.no_stat4, state.stats[3], state);
      }
      state.selectedCard = selectNextCard(state);
    },
    answerYes: (state) => {
      if (state.selectedCard) {
        setValue(state.selectedCard.yes_stat1, state.stats[0], state);
        setValue(state.selectedCard.yes_stat2, state.stats[1], state);
        setValue(state.selectedCard.yes_stat3, state.stats[2], state);
        setValue(state.selectedCard.yes_stat4, state.stats[3], state);
      }
      state.selectedCard = selectNextCard(state);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initializeGame.pending, (state, action) => {
        state.phase = GamePhase.LOADING;
        console.log("GAME", "loading");
      })
      .addCase(initializeGame.fulfilled, (state, action) => {
        state.phase = GamePhase.NOT_STARTED;
        state.definition = action.payload;

        console.log("GAME", "action.payload", action.payload);
      })
      .addCase(initializeGame.rejected, (state, action) => {
        state.phase = GamePhase.ERROR;
        console.log("GAME", "failed", action);
      });
  },
});

export const { updateGame, startGame, answerNo, answerYes } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
