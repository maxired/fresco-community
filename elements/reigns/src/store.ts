import { configureStore } from "@reduxjs/toolkit";
import { gameReducer } from "./features/game/gameSlice";
import { reducer as hostReducer } from "./features/host/hostSlice";
import { reducer as votingReducer } from "./features/voting/votingSlice";

const store = configureStore({
  reducer: {
    game: gameReducer,
    host: hostReducer,
    voting: votingReducer,
  },
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
