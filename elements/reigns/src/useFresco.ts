import { useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { updateGame } from "./features/game/gameSlice";
import { GamePhase } from "./constants";
import { AppState } from "./features/game/types";

export const useFresco = function () {
  const dispatch = useDispatch();

  useEffect(() => {
    fresco.onReady(function () {
      fresco.onStateChanged(function () {
        const state = fresco.element.state;
        console.log("onStateChanged", state);
        dispatch(updateGame(state));
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
    fresco.setState({
      phase: state.game.phase,
      selectedCard: state.game.selectedCard,
      stats: state.game.stats,
    });
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
