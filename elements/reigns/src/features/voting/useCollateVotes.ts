import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { answerNo, answerYes } from "../game/gameSlice";
import { GAME_TABLE } from "../host/determineHost";
import { Answer, AnswerCountdown, ANSWER_KEY } from "./votingSlice";
import { getSdk } from "../../sdk";
import { AppState } from "../../store";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";
import { useTimeout } from "./useTimeout";
import { PARTICIPANT_VOTE_TABLE } from "./useVoteListener";

const COUNTDOWN_SECONDS = 5;

export const useCollateVotes = (isSdkLoaded: boolean) => {
  const answer = useSelector((state: AppState) => state.voting.answer);
  const countdown = useSelector((state: AppState) => state.voting.countdown);

  const persistAnswer = (value: AnswerCountdown | null) => {
    getSdk().storage.realtime.set(GAME_TABLE, ANSWER_KEY, value || undefined);
  };

  const [waitForTeleport, setWaitForTeleport] = useState(false);
  const dispatch = useDispatch();

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

    if (!newAnswer) {
      if (answer) {
        // stop countdown
        persistAnswer(null);
      }
    } else {
      // start (or restart) countdown
      if (!answer || answer != newAnswer) {
        persistAnswer({
          answer: newAnswer,
          countdown: COUNTDOWN_SECONDS,
        });
      }
    }
  }, [frescoUpdate, waitForTeleport]);

  useTimeout(
    () => {
      console.log(
        "answerCountdown",
        JSON.stringify({ answer, countdown }),
        "waitForTeleport",
        waitForTeleport
      );
      if (!isHost) return;
      if (answer && countdown !== null) {
        const newCount = countdown - 1;
        if (newCount < -1) {
          setWaitForTeleport(false);

          console.warn("finished teleport");
          return;
        }

        if (newCount === 0) {
          switch (answer) {
            case "Yes":
              dispatch(answerYes());
              break;
            case "No":
              dispatch(answerNo());
              break;
            default:
              throw new Error("Unknown answer");
          }
          console.warn("starting teleport");
          persistAnswer(null);
          // TODO persist? updateFrescoState();
          setWaitForTeleport(true);
          getSdk().storage.realtime.clear(PARTICIPANT_VOTE_TABLE);
        }

        console.warn("countdown", newCount);
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

const calculateAnswer = (): Answer | undefined => {
  const votes = getParticipantVotes();

  console.log(
    `Votes\n${votes.map((vote) => `${vote.name}: ${vote.answer}`).join("\n")}`
  );

  const results = votes.reduce(
    (memo, participant) => {
      if (participant.answer === "Yes") {
        memo.answerYes++;
      } else if (participant.answer === "No") {
        memo.answerNo++;
      } else {
        memo.waitingForAnswer++;
      }

      return memo;
    },
    {
      answerNo: 0,
      answerYes: 0,
      waitingForAnswer: 0,
    }
  );

  if (results.waitingForAnswer === 0) {
    if (results.answerNo > results.answerYes && results.answerNo > 0) {
      return "No";
    } else if (results.answerYes > results.answerNo && results.answerYes > 0) {
      return "Yes";
    }
  }
};

type Vote = Participant & { answer: Answer | null };

const getParticipantVotes = (): Vote[] => {
  const sdk = getSdk();
  const votes = [
    // include only connected players
    { id: sdk.localParticipant.id, name: sdk.localParticipant.name },
    ...sdk.remoteParticipants,
  ]
    // include only players inside the extension
    .filter((p) => sdk.storage.realtime.get(PARTICIPANT_INSIDE_TABLE, p.id))
    .map((participant) => {
      return {
        ...participant,
        answer: sdk.storage.realtime.get(
          PARTICIPANT_VOTE_TABLE,
          participant.id
        ) as Answer | null,
      };
    });
  return votes;
};
