import { useEffect, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { updateGame } from "./features/game/gameSlice";
import { GamePhase } from "./constants";
import {
  AppState,
  PersistedGameState,
  PersistedState,
} from "./features/game/types";
import { IS_MOUNTED_TABLE } from "./usePersistIsMounted";
import { getSdk } from "./sdk";

export const useFresco = function () {
  const dispatch = useDispatch();
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const sdk = getSdk();

  useEffect(() => {
    sdk.onReady(function () {
      setSdkLoaded(true);
      sdk.onStateChanged(function () {
        const state: PersistedState = sdk.element.state;
        console.log(
          "storage",
          sdk.element.storage,
          "remote participants",
          sdk.remoteParticipants
        );
        dispatch(
          updateGame({
            ...state,
            remoteParticipants: sdk.remoteParticipants,
            mounted: sdk.element.storage[IS_MOUNTED_TABLE],
            localParticipant: sdk.localParticipant,
          })
        );
      });

      const defaultState = {
        selectedCard: null,
        phase: GamePhase.LOADING,
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
    sdk.setState(toPersist);
  };

  const teleport = (
    target: string,
    targetPrefix = `${sdk.element.appearance.NAME}-`
  ) =>
    sdk.send({
      type: "extension/out/redux",
      payload: {
        action: {
          type: "TELEPORT",
          payload: { anchorName: `${targetPrefix}${target}` },
        },
      },
    });

  return { updateFrescoState, teleport, sdkLoaded };
};
