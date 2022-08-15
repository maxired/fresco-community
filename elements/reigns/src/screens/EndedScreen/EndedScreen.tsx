import React from "react";
import { Header } from "../../Header";
import { GameDefinition } from "../../features/game/types";
import { useTextFit } from "../../useTextFit";
import { getEndMessage } from "./utils";

export function EndedScreen({
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
    <div className="screen game--ended">
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
