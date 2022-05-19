import { useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { updateGame } from "./features/game/gameSlice";
import { GamePhase } from "./constants";
import {
  AppState,
  PersistedGameState,
  PersistedState,
} from "./features/game/types";
import { IS_MOUNTED_TABLE } from "./usePersistIsMounted";

export const useFresco = function () {
  const dispatch = useDispatch();

  useEffect(() => {
    fresco.onReady(function () {
      fresco.onStateChanged(function () {
        const state: PersistedState = fresco.element.state;
        console.log(
          "storage",
          fresco.element.storage,
          "remote participants",
          fresco.remoteParticipants
        );
        dispatch(
          updateGame({
            ...state,
            remoteParticipants: fresco.remoteParticipants,
            mounted: fresco.element.storage[IS_MOUNTED_TABLE],
            localParticipant: fresco.localParticipant,
          })
        );
      });

      const defaultState = {
        selectedCard: null,
        phase: GamePhase.LOADING,
        stats: [],
        gameUrl: "games/gdpr.json",
      };

      fresco.initialize(defaultState, {
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
    fresco.setState(toPersist);
  };

  const teleport = (
    target: string,
    targetPrefix = `${fresco.element.appearance.NAME}-`
  ) =>
    fresco.send({
      type: "extension/out/redux",
      payload: {
        action: {
          type: "TELEPORT",
          payload: { anchorName: `${targetPrefix}${target}` },
        },
      },
    });

  return { updateFrescoState, teleport };
};
