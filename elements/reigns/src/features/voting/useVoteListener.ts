import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GamePhase } from "../../constants";
import { getSdk } from "../../sdk";
import { AppState } from "../../store";
import { Answer } from "./votingSlice";

export const PARTICIPANT_VOTE_TABLE = "participants-vote";

export const useVoteListener = (
  phase: GamePhase,
  teleport: (target: string, targetPrefix?: string) => void
) => {
  const persistParticipantVote = (answer: Answer | null) => {
    const sdk = getSdk();
    console.warn("Setting vote to", answer);
    sdk.storage.realtime.set(
      PARTICIPANT_VOTE_TABLE,
      sdk.localParticipant.id,
      answer ?? undefined
    );
  };

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
        persistParticipantVote("Yes");
      });

      const noListener = sdk.subscribeToGlobalEvent("custom.reign.no", () => {
        console.log("vote no");
        persistParticipantVote("No");
      });

      const removeVoteListener = sdk.subscribeToGlobalEvent(
        "custom.reign.remove-vote",
        () => {
          persistParticipantVote(null);
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
