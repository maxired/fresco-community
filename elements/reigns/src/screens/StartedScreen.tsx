import React from "react";
import { Header } from "../Header";
import { Question } from "../Question";
import { AnswerArea } from "../AnswerArea";
import { Countdown } from "../Countdown";
import { Card, GameDefinition } from "../features/game/types";

export const StartedScreen = ({
  gameDefinition,
  currentStats,
  round,
  selectedCard,
  noProgress,
  yesProgress,
  noVotesMissing,
  yesVotesMissing,
  countdown,
  doRestartGame,
}: {
  gameDefinition: GameDefinition;
  currentStats: number[];
  round: number;
  selectedCard: Card;
  noProgress: number;
  yesProgress: number;
  noVotesMissing: number | null;
  yesVotesMissing: number | null;
  countdown: Countdown;
  doRestartGame: () => void;
}) => (
  <>
    <div className="game-half first-half game--started" onClick={doRestartGame}>
      <Header definition={gameDefinition} stats={currentStats} round={round} />
      <Question card={selectedCard} />
    </div>
    <div className="game-half answers">
      <AnswerArea
        text={selectedCard.answer_no || "No"}
        answer="no"
        progress={noProgress}
        color="#e200a4"
        votesMissing={noVotesMissing}
      />
      <div className="answer answer--neutral">
        {countdown.isVoting && (
          <div className="countdown" data-testid="countdown">
            <>{countdown.value}...</>
          </div>
        )}
      </div>
      <AnswerArea
        text={selectedCard.answer_yes || "Yes"}
        answer="yes"
        progress={yesProgress}
        color="#9e32d6"
        votesMissing={yesVotesMissing}
      />
    </div>
  </>
);
