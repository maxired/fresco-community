import { useEffect } from "react";
import { GamePhase } from "../../constants";
import { Logger } from "../../Logger";
import { getSdk } from "../../sdk";
import { persistParticipantVote } from "./persistence";

export const useVoteListener = (phase: GamePhase) => {
  useEffect(() => {
    if (phase === GamePhase.STARTED) {
      const sdk = getSdk();
      const yesListener = sdk.subscribeToGlobalEvent("custom.reign.yes", () => {
        Logger.log(Logger.VOTE, "vote yes");
        persistParticipantVote(sdk.localParticipant.id, "Yes");
      });

      const noListener = sdk.subscribeToGlobalEvent("custom.reign.no", () => {
        Logger.log(Logger.VOTE, "vote no");
        persistParticipantVote(sdk.localParticipant.id, "No");
      });

      const removeVoteListener = sdk.subscribeToGlobalEvent(
        "custom.reign.remove-vote",
        () => {
          Logger.log(Logger.VOTE, "remove vote");
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
