import { Answer } from "./votingSlice";
import { getSdk } from "../../sdk";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";
import { PARTICIPANT_VOTE_TABLE } from "./useVoteListener";

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
type Vote = Participant & { answer: Answer | null };
const getParticipantVotes = (): Vote[] => {
  const sdk = getSdk();
  const connectedPlayers = [
    { id: sdk.localParticipant.id, name: sdk.localParticipant.name },
    ...sdk.remoteParticipants,
  ];
  const playersInsideExtension = connectedPlayers.filter((p) =>
    sdk.storage.realtime.get(PARTICIPANT_INSIDE_TABLE, p.id)
  );
  const votes = playersInsideExtension.map((participant) => {
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
