import { Answer, getParticipantVotes } from "./persistence";

export type VoteProgress = {
  noProgress: number;
  yesProgress: number;
};

type CalculatedAnswer = {
  answer: Answer | null;
  everyoneVoted: boolean;
} & VoteProgress;

export const calculateAnswer = (): CalculatedAnswer => {
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
  const totalParticipants = votes.length;
  const votesNeededForMajority = Math.ceil(totalParticipants / 2);
  const progress: VoteProgress = {
    noProgress: results.answerNo / votesNeededForMajority,
    yesProgress: results.answerYes / votesNeededForMajority,
  };

  console.log("progress", results, progress);

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
