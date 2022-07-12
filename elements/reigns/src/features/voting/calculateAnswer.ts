import { Answer, getParticipantVotes } from "./persistence";

export const calculateAnswer = (): CollatedVote => {
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
  const everyoneVoted = results.waitingForAnswer === 0;

  if (results.answerNo || results.answerYes) {
    const moreThanHalfAnswered =
      results.answerNo + results.answerYes > results.waitingForAnswer;
    if (results.answerNo === results.answerYes || !moreThanHalfAnswered) {
      return { answer: null, everyoneVoted };
    }
    return {
      answer: results.answerNo > results.answerYes ? "No" : "Yes",
      everyoneVoted,
    };
  }

  return { answer: null, everyoneVoted };
};

type CollatedVote = {
  answer: Answer | null;
  everyoneVoted: boolean;
};
