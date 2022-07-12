import { useEffect } from "react";
import { useSelector } from "react-redux";
import { GamePhase } from "../../constants";
import { getSdk } from "../../sdk";
import { AppState } from "../../store";
import { persistParticipantVote } from "./persistence";

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

export const useVoteListener = (phase: GamePhase) => {
  const round = useSelector((state: AppState) => state.game.round);

  useEffect(() => {
    // teleport to neutral zone at the beginning of each round
    teleport("neutral");
  }, [round]);

  useEffect(() => {
    if (phase === GamePhase.STARTED) {
      const sdk = getSdk();
      const yesListener = sdk.subscribeToGlobalEvent("custom.reign.yes", () => {
        console.log("vote yes");
        persistParticipantVote(sdk.localParticipant.id, "Yes");
      });

      const noListener = sdk.subscribeToGlobalEvent("custom.reign.no", () => {
        console.log("vote no");
        persistParticipantVote(sdk.localParticipant.id, "No");
      });

      const removeVoteListener = sdk.subscribeToGlobalEvent(
        "custom.reign.remove-vote",
        () => {
          persistParticipantVote(sdk.localParticipant.id, null);
        }
      );

      return () => {
        yesListener();
        noListener();
        removeVoteListener();
      };
    }
  }, [phase]);
};
