import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GamePhase, Loading } from "../../constants";
import { selectNextCard } from "./selectNextCard";
import { Configuration, GameState, PersistedGameState, Stat } from "./types";
import { validateGameDefinition } from "./validateGameDefinition";
import { getSdk } from "../../sdk";
import { GAME_TABLE } from "../host/determineHost";
import { selectAnswer, selectNo, selectYes } from "./selectAnswer";

export const GAME_STATE_KEY = "state";

export const persistState = (state: PersistedGameState) => {
  const sdk = getSdk();
  sdk.storage.realtime.set(GAME_TABLE, GAME_STATE_KEY, state);
};

export const initializeGame = createAsyncThunk(
  "game/initializeGame",
  async (gameUrl: string) => {
    const response = await fetch(gameUrl);
    console.log("GAME", "response", response);

    const json = await response.json();
    console.log("GAME", "json", json);

    return json;
  }
);

export const initialState: GameState = {
  loading: Loading.InProgress,
  phase: GamePhase.NOT_STARTED,
  selectedCard: null,
  stats: [],
  flags: {},
  gameUrl: null,
  definition: null,
  round: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateGame: (state, action: PayloadAction<PersistedGameState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateConfig: (state, action: PayloadAction<Configuration>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    startGame: (state: GameState) => {
      persistState({
        phase: GamePhase.STARTED,
        selectedCard: selectNextCard(state.definition, state.flags),
        stats: state.definition
          ? state.definition.stats.map((stat: Stat) => ({ ...stat }))
          : [],
        round: state.round++,
        flags: {},
      });
    },
    answerNo: (state: GameState) => {
      if (state.selectedCard) {
        persistState(selectAnswer(state, "no_custom"));
      }
    },
    answerYes: (state) => {
      if (state.selectedCard) {
        persistState(selectAnswer(state, "yes_custom"));
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initializeGame.pending, (state, action) => {
        state.loading = Loading.InProgress;
        console.log("GAME", "loading");
      })
      .addCase(initializeGame.fulfilled, (state, action) => {
        state.loading = Loading.Ended;

        try {
          state.definition = validateGameDefinition(action.payload);
        } catch (e) {
          console.error(e);
          state.loading = Loading.Error;
        }

        console.log("GAME", "action.payload", action.payload);
      })
      .addCase(initializeGame.rejected, (state, action) => {
        state.loading = Loading.Error;
        console.log("GAME", "failed", action);
      });
  },
});

export const { updateGame, startGame, answerNo, answerYes, updateConfig } =
  gameSlice.actions;
export const gameReducer = gameSlice.reducer;
