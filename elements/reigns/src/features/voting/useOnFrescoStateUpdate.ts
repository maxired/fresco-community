import { useRef, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { setPhase, updateConfig, updateGame } from "../game/gameSlice";
import { updateHost } from "../host/hostSlice";
import { updateVote } from "./votingSlice";
import { persistIsInsideElement } from "./persistIsInsideElement";
import { getSdk } from "../../sdk";
import { Game } from "../game/Game";
import { GamePhase } from "../../constants";
import { AppState } from "../../store";
import { animateRoundTransition } from "./animateRoundTransition";

export const PARTICIPANT_INSIDE_TABLE = "participants-inside";

export const useOnFrescoStateUpdate = () => {
  const dispatch = useDispatch();
  const store = useStore();

  const prevLocalParticipantRef = useRef<{
    id: string | null;
    isInsideElement: boolean | null;
  }>({ id: null, isInsideElement: null });
  return () => {
    const prevState = store.getState() as AppState;
    const state = new Game().retrieve();

    if (state) {
      if (
        state.phase !== GamePhase.NOT_STARTED &&
        (state.round > prevState.game.round ||
          state.phase !== prevState.game.phase)
      ) {
        if (!prevState.transition.round) {
          void animateRoundTransition(
            dispatch,
            prevState,
            state,
            prevState.game.phase === GamePhase.NOT_STARTED ||
              prevState.game.phase === GamePhase.ENDED
          );
        }
      } else {
        dispatch(
          updateGame({
            flags: state.flags,
            phase: state.phase,
            round: state.round,
            selectedCard: state.selectedCard,
            stats: state.stats,
            previouslySelectedCardIds: state.previouslySelectedCardIds,
          })
        );
      }
    } else {
      dispatch(setPhase(GamePhase.NOT_STARTED));
    }
    const sdk = getSdk();
    if (sdk.element.state) {
      dispatch(
        updateConfig({
          gameUrl: sdk.element.state.gameUrl,
          designerCardsCsv: sdk.element.state.cards,
        })
      );
    }
    dispatch(updateHost());
    dispatch(updateVote());
    persistIsInsideElement(prevLocalParticipantRef);
  };
};
