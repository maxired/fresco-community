import { useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { AnswerCountdown, ANSWER_KEY } from "./votingSlice";
import { getSdk } from "../../sdk";
import { AppState } from "../../store";
import { useTimeout } from "./useTimeout";
import { PARTICIPANT_VOTE_TABLE } from "./useVoteListener";
import { Game, GAME_TABLE } from "../game/Game";
import { calculateAnswer } from "./calculateAnswer";

export const COUNTDOWN_SECONDS = 5;

export const useCollateVotes = (isSdkLoaded: boolean) => {
  const answer = useSelector((state: AppState) => state.voting.answer);
  const countdown = useSelector((state: AppState) => state.voting.countdown);
  const store = useStore<AppState>();

  const persistAnswer = (value: AnswerCountdown | null) => {
    getSdk().storage.realtime.set(GAME_TABLE, ANSWER_KEY, value || undefined);
  };

  const [waitForTeleport, setWaitForTeleport] = useState(false);

  const frescoUpdate = useSelector(
    (state: AppState) => state.host.frescoUpdateCount
  );
  const isHost = useSelector((state: AppState) => {
    if (!isSdkLoaded) return;
    const sdk = getSdk();
    return state.host.currentHost?.id === sdk.localParticipant.id;
  });

  useEffect(() => {
    if (waitForTeleport || !isSdkLoaded || !isHost) return;

    const newAnswer = calculateAnswer();

    if (!newAnswer.answer) {
      if (answer) {
        // stop countdown
        persistAnswer(null);
      }
    } else {
      // start (or restart) countdown
      if (!answer || answer != newAnswer.answer) {
        persistAnswer({
          answer: newAnswer.answer,
          countdown: COUNTDOWN_SECONDS,
        });
      }
    }
  }, [frescoUpdate, waitForTeleport]);

  useTimeout(
    () => {
      console.log(JSON.stringify({ answer, countdown, waitForTeleport }));
      if (!isHost) return;
      if (answer && countdown !== null) {
        const newCount = countdown - 1;
        // let the count go to -1 to allow for teleport time across clients
        if (newCount < -1) {
          setWaitForTeleport(false);
          return;
        }

        if (newCount === 0) {
          const game = new Game();
          switch (answer) {
            case "Yes":
              game.answerYes(store.getState().game);
              break;
            case "No":
              game.answerNo(store.getState().game);
              break;
            default:
              throw new Error("Unknown answer");
          }
          persistAnswer(null);
          setWaitForTeleport(true);
          getSdk().storage.realtime.clear(PARTICIPANT_VOTE_TABLE);
        }

        persistAnswer({
          answer,
          countdown: newCount,
        });
      }
    },
    1000,
    [answer, countdown]
  );

  return waitForTeleport || !answer ? null : { answer, countdown };
};
