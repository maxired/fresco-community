import { updateGame } from "../game/gameSlice";
import { getSdk } from "../../sdk";
import {
  QUESTION_CHANGE_DELAY,
  RESOURCE_CHANGE_DELAY,
  TELEPORT_START_DELAY,
} from "../../constants";
import { AppState } from "../../store";
import { PersistedGameState } from "../game/types";
import { teleport } from "./teleport";
import {
  endQuestionAndAnswersTransition,
  endRoundTransition,
  startQuestionAndAnswersTransition,
  startRoundTransition,
} from "../transition/fadeSlice";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { Logger } from "../../Logger";

export const animateRoundTransition = async (
  dispatch: Dispatch<AnyAction>,
  storedState: AppState,
  state: PersistedGameState,
  immediate: boolean = false
) => {
  Logger.log(Logger.TRANSITION, "Start");
  dispatch(startRoundTransition());
  if (!immediate) {
    Logger.log(Logger.TRANSITION, "Teleporting...");
    await wait(TELEPORT_START_DELAY);
  }
  if (getSdk().localParticipant.isInsideElement) {
    // maybe participant is only looking at the game
    teleport("neutral");
    Logger.log(Logger.TRANSITION, "Teleported!");
  }
  if (!immediate) {
    Logger.log(Logger.TRANSITION, "Changing resources...");
    await wait(RESOURCE_CHANGE_DELAY);
  }
  dispatch(updateGame({ ...storedState.game, stats: state.stats }));
  Logger.log(Logger.TRANSITION, "Resources updated!");
  dispatch(startQuestionAndAnswersTransition());
  if (!immediate) {
    Logger.log(Logger.TRANSITION, "Changing question...");
    await wait(QUESTION_CHANGE_DELAY);
  }
  dispatch(updateGame({ ...storedState.game, ...state }));
  Logger.log(Logger.TRANSITION, "Question updated!");
  dispatch(endQuestionAndAnswersTransition());
  dispatch(endRoundTransition());
  Logger.log(Logger.TRANSITION, "End");
};
const wait = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));
