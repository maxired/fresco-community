import React from "react";
import { GameDefinition } from "../features/game/types";
import { useTextFit } from "../useTextFit";

export function NotStartedScreen({
  gameDefinition,
  isHost,
  doRestartGame,
}: {
  gameDefinition: GameDefinition | null;
  isHost: string | boolean | undefined;
  doRestartGame: () => void;
}) {
  const messageRef = useTextFit(gameDefinition?.gameName);

  return (
    <div className="screen game--not-started">
      <div className="end">
        <div className="end__message" ref={messageRef} />
        {isHost && (
          <button className="end__restart_button" onClick={doRestartGame}>
            Start game
          </button>
        )}
        {!isHost && <div>Waiting for host to start...</div>}
      </div>
    </div>
  );
}
