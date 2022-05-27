import { useEffect, useRef } from "react";
import { GamePhase } from "../../constants";
import { getSdk } from "../../sdk";
import { SelectedCard } from "../game/types";
import { Answer } from "./votingSlice";

export const PARTICIPANT_VOTE_TABLE = "participants-vote";

export const useVoteListener = (
  phase: GamePhase,
  selectedCard: SelectedCard | null,
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

  const prevSelectionCardRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    // resetting vote on card change
    if (prevSelectionCardRef.current !== selectedCard?.selectionId) {
      prevSelectionCardRef.current = selectedCard?.selectionId;
      teleport("neutral");
    }
  }, [selectedCard]);

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
