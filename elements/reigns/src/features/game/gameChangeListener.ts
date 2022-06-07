import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";

import { AppDispatch, AppState } from "../../store";
import { updateConfig } from "./gameSlice";
import { getIsHost } from "../host/persistence";
import { Game } from "./Game";
import { isEqual } from "lodash";

export const gameChangeListenerMiddleware = createListenerMiddleware();

type AppStartListening = TypedStartListening<AppState, AppDispatch>;
const startAppListening =
  gameChangeListenerMiddleware.startListening as AppStartListening;

startAppListening({
  actionCreator: updateConfig,
  effect: (action, listenerApi) => {
    detectGameChange(listenerApi.getOriginalState(), listenerApi.getState());
  },
});

export const detectGameChange = (previous: AppState, current: AppState) => {
  const isHost = getIsHost(previous.host);

  if (!isHost) return;
  if (!previous.game.gameUrl) return;

  if (
    current.game.gameUrl !== previous.game.gameUrl ||
    !isEqual(current.game.designerCards, previous.game.designerCards)
  ) {
    new Game().changeGame();
  }
};
