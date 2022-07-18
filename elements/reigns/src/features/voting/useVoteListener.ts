import { useEffect } from "react";
import { useSelector } from "react-redux";
import { GamePhase, TELEPORT_DELAY } from "../../constants";
import { getSdk } from "../../sdk";
import { AppState } from "../../store";
import { persistParticipantVote } from "./persistence";

export const useVoteListener = (phase: GamePhase) => {

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
