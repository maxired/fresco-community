import { useEffect, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { GamePhase } from "./constants";
import { frescoUpdate } from "./features/host/hostSlice";
import { PersistedGameState } from "./features/game/types";
import { getSdk } from "./sdk";
import { AppState } from "./store";

export const useFresco = function (
  onUpdate: (updateState: () => void) => void
) {
  const dispatch = useDispatch();
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    const sdk = getSdk();
    sdk.onReady(function () {
      sdk.onStateChanged(() => {
        if (!sdkLoaded) setSdkLoaded(true);
        onUpdate(updateFrescoState);
        dispatch(frescoUpdate());
      });

      const defaultState = {
        selectedCard: null,
        phase: GamePhase.NOT_STARTED,
        stats: [],
        gameUrl: "games/gdpr.json",
      };

      sdk.initialize(defaultState, {
        title: "Reigns",
        toolbarButtons: [
          {
            title: "Game url",
            ui: { type: "string" },
            property: "gameUrl",
          },
        ],
      });
    });
  }, []);

  const store = useStore<AppState>();
  const updateFrescoState = () => {
    const state = store.getState();
    console.log("updateFrescoGameState", state);
    const toPersist: PersistedGameState = {
      phase: state.game.phase,
      selectedCard: state.game.selectedCard,
      stats: state.game.stats,
    };
    getSdk().setState(toPersist);
  };

  const teleport = (target: string, targetPrefix?: string) => {
    const sdk = getSdk();
    const defaultTargetPrefix = `${sdk.element.appearance.NAME}-`;
    sdk.send({
      type: "extension/out/redux",
      payload: {
        action: {
          type: "TELEPORT",
          payload: {
            anchorName: `${targetPrefix ?? defaultTargetPrefix}${target}`,
          },
        },
      },
    });
  };

  return { updateFrescoState, teleport, sdkLoaded };
};
