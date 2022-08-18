import React from "react";
import { Header } from "../Header";
import { Question } from "../Question";
import { AnswerArea } from "../AnswerArea";
import { Countdown } from "../Countdown";
import { Card, GameDefinition } from "../features/game/types";
import { AnswerText } from "../AnswerText";

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
    <div className="screen game--started" onClick={doRestartGame}>
      <Header definition={gameDefinition} stats={currentStats} />
      <Question card={selectedCard} />
      <div className="answers">
        {selectedCard.answer_no ? (
          <AnswerText
            text={selectedCard.answer_no || "No"}
            answer="no"
            progress={noProgress}
            color="#e200a4"
            votesMissing={noVotesMissing}
          />
        ) : (
          <div className="answer" />
        )}
        <div className="answer">
          <div className="round">
            {gameDefinition.roundName} {round}
          </div>
        </div>

        {selectedCard.answer_yes ? (
          <AnswerText
            text={selectedCard.answer_yes || "Yes"}
            answer="yes"
            progress={yesProgress}
            color="#9e32d6"
            votesMissing={yesVotesMissing}
          />
        ) : (
          <div className="answer" />
        )}
      </div>
    </div>
    <div className="answers floor">
      <AnswerArea answer="no" visible={Boolean(selectedCard.answer_no)} />
      <div className="answer answer--neutral">
        {countdown.isVoting && (
          <div className="countdown" data-testid="countdown">
            <>{countdown.value}...</>
          </div>
        )}
      </div>
      <AnswerArea answer="yes" visible={Boolean(selectedCard.answer_yes)} />
    </div>
  </>
);
