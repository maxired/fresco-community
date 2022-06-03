import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GamePhase } from "./constants";
import { updateHost } from "./features/host/hostSlice";
import { getSdk } from "./sdk";

export const useFresco = function (onUpdate: () => void) {
  const dispatch = useDispatch();
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    getSdk().onReady(function () {
      if (!sdkLoaded) setSdkLoaded(true);
      const sdk = getSdk();
      sdk.onStateChanged(() => {
        onUpdate();
        dispatch(updateHost());
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
  }, [sdkLoaded]);

  return { sdkLoaded };
};
