import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GamePhase } from "./constants";
import { updateHost } from "./features/host/hostSlice";
import { getSdk } from "./sdk";

export const useFresco = function (onUpdate: () => void) {
  const dispatch = useDispatch();
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    const sdk = getSdk();
    sdk.onReady(function () {
      sdk.onStateChanged(() => {
        if (!sdkLoaded) setSdkLoaded(true);
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
  }, []);

  const teleport = (target: string, targetPrefix?: string) => {
    const sdk = getSdk();
    if (sdk.element.appearance) {
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
    }
  };

  return { teleport, sdkLoaded };
};
