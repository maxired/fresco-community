import { Answer, getLatestVote, VotingState } from "./votingSlice";
import { getSdk } from "../../sdk";
import { PARTICIPANT_VOTE_TABLE } from "./useVoteListener";
import { Game } from "../game/Game";
import { GameState } from "../game/types";
import { persistAnswer } from "./persistAnswer";
import { calculateAnswer } from "./calculateAnswer";

export const COUNTDOWN_SECONDS = 5;

export const resolveRound = (gameState: GameState) => {
  const { answer, countdown, everyoneVoted } = collateVotesAndPersist();

  console.log("Current vote", answer, countdown);

  if (!answer || countdown === null) return;

  const newCount = everyoneVoted && countdown > 0 ? 0 : countdown - 1;
  // let the count go to -1 to allow for teleport time across clients
  if (newCount < -1) {
    if (newCount < -2) {
      // we got out of sync, reset the vote
      persistAnswer(null);
      return;
    }
  } else if (newCount === 0) {
    const game = new Game();
    switch (answer) {
      case "Yes":
        game.answerYes(gameState);
        break;
      case "No":
        game.answerNo(gameState);
        break;
      default:
        throw new Error("Unknown answer");
    }
    console.warn("Clearing votes");
    getSdk().storage.realtime.clear(PARTICIPANT_VOTE_TABLE);
    persistAnswer(null);
  }
  persistAnswer({
    answer,
    countdown: newCount,
  });
};

const collateVotesAndPersist = (): VotingState & { everyoneVoted: boolean } => {
  const { answer: persistedAnswer, countdown } = getLatestVote();
  const newAnswer = calculateAnswer();
  if ((countdown ?? 0) < 0) return { ...newAnswer, countdown };

  if (!newAnswer.answer) {
    if (persistedAnswer) {
      // stop countdown
      persistAnswer(null);
      return { answer: null, countdown: null, everyoneVoted: false };
    }
  } else {
    // start (or restart) countdown
    if (!persistedAnswer || persistedAnswer != newAnswer.answer) {
      const countdown = newAnswer.everyoneVoted ? 0 : COUNTDOWN_SECONDS;
      const toPersist = {
        answer: newAnswer.answer,
        // first tick happens immediately
        countdown: countdown + 1,
      };
      persistAnswer(toPersist);
      return { ...toPersist, everyoneVoted: newAnswer.everyoneVoted };
    }
  }
  return { ...newAnswer, countdown };
};
