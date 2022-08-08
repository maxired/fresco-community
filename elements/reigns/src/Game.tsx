import React, { useEffect } from "react";
import { Header } from "./Header";
import { Question } from "./Question";
import { useSelector, useStore } from "react-redux";
import { GamePhase, VICTORY_FLAG_NAME, VICTORY_FLAG_VALUE } from "./constants";
import { usePersistIsMounted } from "./features/host/usePersistIsMounted";
import { AppState } from "./store";
import { useVoteListener } from "./features/voting/useVoteListener";
import { useCollateVotes } from "./features/voting/useCollateVotes";
import { Game as GamePersistence } from "./features/game/Game";
import { getIsHost } from "./features/host/persistence";
import { AnswerArea } from "./AnswerArea";
import { Countdown } from "./Countdown";
import { getSdk } from "./sdk";
import { GameDefinition } from "./features/game/types";
import { useTextFit } from "./useTextFit";

export const Game = () => {
  const currentHost = useSelector((state: AppState) => state.host.currentHost);
  const countdown = Countdown.from(
    useSelector((state: AppState) => state.voting.countdown)
  );
  const phase = useSelector((state: AppState) => state.game.phase);
  const isGameWon = useSelector(
    (state: AppState) =>
      state.game.flags[VICTORY_FLAG_NAME] === VICTORY_FLAG_VALUE
  );

  const round = useSelector((state: AppState) => state.game.round);
  const selectedCard = useSelector(
    (state: AppState) => state.game.selectedCard
  );
  const currentStats = useSelector((state: AppState) => state.game.stats);
  const gameDefinition = useSelector(
    (state: AppState) => state.game.definition
  );
  const store = useStore<AppState>();
  const isHost = getIsHost({ currentHost });
  const yesProgress = useSelector(
    (state: AppState) => state.voting.yesProgress
  );
  const noProgress = useSelector((state: AppState) => state.voting.noProgress);
  const yesVotesMissing = useSelector(
    (state: AppState) => state.voting.yesVotesMissing
  );
  const noVotesMissing = useSelector(
    (state: AppState) => state.voting.noVotesMissing
  );

  usePersistIsMounted();

  useVoteListener(phase);

  useCollateVotes();

  useEffect(() => {
    const sdk = getSdk();
    if (phase === GamePhase.ENDED) {
      if (isGameWon) {
        sdk.triggerEvent({
          eventName: "custom.reigns.phase.end.victory",
        });
      } else {
        sdk.triggerEvent({
          eventName: "custom.reigns.phase.end.death",
        });
      }
    } else {
      sdk.triggerEvent({
        eventName: `custom.reigns.phase.${phase}`,
      });
    }
  }, [phase, isGameWon]);

  const doRestartGame = () => {
    if (isHost) {
      const gameState = store.getState().game;
      new GamePersistence().startGame(gameState);
    }
  };

  if (phase === GamePhase.NOT_STARTED) {
    return (
      <div className="game-half first-half">
        <div className="end">
          <div className="end__message">{gameDefinition?.gameName}</div>
          {isHost && <button onClick={doRestartGame}>Start game</button>}
          {!isHost && <div>Waiting for host to start...</div>}
        </div>
      </div>
    );
  }

  if (!gameDefinition) {
    return null;
  }

  if (phase === GamePhase.ENDED) {
    return (
      <EndScreen
        gameDefinition={gameDefinition}
        currentStats={currentStats}
        isGameWon={isGameWon}
        round={round}
        isHost={isHost}
        doRestartGame={doRestartGame}
      />
    );
  }

  if (!selectedCard) {
    return null;
  }

  return (
    <>
      <div className="game-half first-half" onClick={doRestartGame}>
        <Header
          definition={gameDefinition}
          stats={currentStats}
          round={round}
        />
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
};

const getEndMessage = (
  gameDefinition: GameDefinition,
  statsValues: number[],
  isGameWon: boolean
) => {
  if (isGameWon) {
    return gameDefinition.victoryMessage;
  }

  const emptyIndex = statsValues.findIndex((statValue) => statValue <= 0);
  if (emptyIndex > -1) {
    return (
      gameDefinition.stats[emptyIndex].deathMessage ??
      gameDefinition.deathMessage
    );
  }

  return gameDefinition.deathMessage;
};
function EndScreen({
  gameDefinition,
  currentStats,
  isGameWon,
  round,
  isHost,
  doRestartGame,
}: {
  gameDefinition: GameDefinition;
  currentStats: number[];
  isGameWon: boolean;
  round: number;
  isHost: string | boolean | undefined;
  doRestartGame: () => void;
}) {
  const endMessage = getEndMessage(gameDefinition, currentStats, isGameWon);

  const messageRef = useTextFit(endMessage);

  return (
    <div className="game-half first-half">
      <Header definition={gameDefinition} stats={currentStats} round={round} />

      <div className="end">
        <div className="end__message" ref={messageRef} />
        {isHost && (
          <button onClick={doRestartGame} className="end__restart_button">
            Play again
          </button>
        )}
      </div>
    </div>
  );
}
