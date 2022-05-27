import { useRef } from "react";
import { useDispatch } from "react-redux";
import { GAME_STATE_KEY, updateConfig, updateGame } from "../game/gameSlice";
import { frescoUpdate } from "../host/hostSlice";
import { updateVote } from "./votingSlice";
import { persistIsInsideElement } from "./persistIsInsideElement";
import { getSdk } from "../../sdk";
import { GAME_TABLE } from "../host/determineHost";
import { PersistedGameState } from "../game/types";

export const PARTICIPANT_INSIDE_TABLE = "participants-inside";

export const useOnFrescoStateUpdate = () => {
  const dispatch = useDispatch();
  const prevLocalParticipantRef = useRef<{
    id: string | null;
    isInsideElement: boolean | null;
  }>({ id: null, isInsideElement: null });
  return () => {
    const sdk = getSdk();
    const state = sdk.storage.realtime.get(
      GAME_TABLE,
      GAME_STATE_KEY
    ) as PersistedGameState;
    if (state) {
      dispatch(
        updateGame({
          flags: state.flags,
          phase: state.phase,
          round: state.round,
          selectedCard: state.selectedCard,
          stats: state.stats,
        })
      );
    }
    if (sdk.element.state) {
      dispatch(updateConfig({ gameUrl: sdk.element.state.gameUrl }));
    }
    dispatch(frescoUpdate());
    dispatch(updateVote());
    persistIsInsideElement(prevLocalParticipantRef);
  };
};
