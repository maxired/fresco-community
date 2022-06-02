import { useState } from "react";
import { useStore } from "react-redux";
import { getSdk } from "../../sdk";
import { AppState } from "../../store";
import { useInterval } from "./useInterval";
import { GamePhase } from "../../constants";
import { resolveRound } from "./resolveRound";

export const useCollateVotes = (isSdkLoaded: boolean) => {
  const store = useStore<AppState>();

  useInterval(
    () => {
      if (!isSdkLoaded) return;
      const sdk = getSdk();
      const state = store.getState();
      const isHost = state.host.currentHost?.id === sdk.localParticipant.id;
      if (!isHost) return;
      const phase = state.game.phase;
      if (phase !== GamePhase.STARTED) return;
      resolveRound(state.game);
    },
    1000,
    [store]
  );
};
