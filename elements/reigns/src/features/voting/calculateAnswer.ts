import { DEBUG } from "../../constants";
import { Logger } from "../../Logger";
import { Answer, getParticipantVotes } from "./persistence";

export type VoteProgress = {
  noProgress: number;
  yesProgress: number;
  noVotesMissing: number | null;
  yesVotesMissing: number | null;
};

type CalculatedAnswer = {
  answer: Answer | null;
  everyoneVoted: boolean;
} & VoteProgress;

export const calculateAnswer = (): CalculatedAnswer => {
  const votes = getParticipantVotes();

  Logger.log(
    Logger.VOTE,
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
  const totalParticipants = votes.length;
  const votesNeededForAbove50Percent = Math.floor(totalParticipants / 2) + 1;
  const progress: VoteProgress = {
    noProgress: results.answerNo / votesNeededForAbove50Percent,
    yesProgress: results.answerYes / votesNeededForAbove50Percent,
    noVotesMissing: Math.max(
      votesNeededForAbove50Percent - results.answerNo,
      0
    ),
    yesVotesMissing: Math.max(
      votesNeededForAbove50Percent - results.answerYes,
      0
    ),
  };

  const everyoneVoted = results.waitingForAnswer === 0;

  if (results.answerNo || results.answerYes) {
    const moreThanHalfAnswered =
      results.answerNo + results.answerYes > results.waitingForAnswer;
    if (results.answerNo === results.answerYes || !moreThanHalfAnswered) {
      return { answer: null, everyoneVoted, ...progress };
    }
    return {
      answer: results.answerNo > results.answerYes ? "No" : "Yes",
      everyoneVoted,
      ...progress,
    };
  }

  return { answer: null, everyoneVoted, ...progress };
};
