import { configureStore } from "@reduxjs/toolkit";
import { gameReducer } from "./features/game/gameSlice";
import { reducer as hostReducer } from "./features/host/hostSlice";

const store = configureStore({
  reducer: {
    game: gameReducer,
    host: hostReducer,
  },
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
