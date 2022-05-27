import React, { Dispatch, useEffect } from "react";
import { Meters } from "./Meters";
import { Question } from "./Question";
import { NoAnswer } from "./NoAnswer";
import { YesAnswer } from "./YesAnswer";
import { useSelector, useDispatch, useStore } from "react-redux";
import { initializeGame, startGame } from "./features/game/gameSlice";
import { GamePhase, Loading } from "./constants";
import { useFresco } from "./useFresco";
import { usePersistIsMounted } from "./features/host/usePersistIsMounted";
import { AppState } from "./store";
import { useOnFrescoStateUpdate } from "./features/voting/useOnFrescoStateUpdate";
import { useVoteListener } from "./features/voting/useVoteListener";
import { useCollateVotes } from "./features/voting/useCollateVotes";
import { getSdk } from "./sdk";

export default function App() {
  const phase = useSelector((state: AppState) => state.game.phase);
  const loading = useSelector((state: AppState) => state.game.loading);
  const selectedCard = useSelector(
    (state: AppState) => state.game.selectedCard
  );
  const host = useSelector((state: AppState) => state.host.currentHost);
  const currentStats = useSelector((state: AppState) => state.game.stats);
  const gameUrl = useSelector((state: AppState) => state.game.gameUrl);
  const gameDefinition = useSelector(
    (state: AppState) => state.game.definition
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!gameUrl) {
      return;
    }
    dispatch(initializeGame(gameUrl) as any);
  }, [gameUrl]);

  const onFrescoStateUpdate = useOnFrescoStateUpdate();

  const { teleport, sdkLoaded } = useFresco(onFrescoStateUpdate);

  usePersistIsMounted(sdkLoaded);

  useVoteListener(phase, teleport);

  const answerCountdown = useCollateVotes(sdkLoaded);

  const doRestartGame = () => {
    if (isHost) {
      dispatch(startGame());
    }
  };

  const isHost = host && getSdk().localParticipant.id === host?.id;

  if (loading === Loading.InProgress) {
    return <div className="death">Loading...</div>;
  }

  if (loading === Loading.Error) {
    return <div className="death">ERROR :(</div>;
  }

  if (phase === GamePhase.ENDED) {
    return (
      <>
        <div className="death">
          {gameDefinition?.deathMessage}
          {isHost && <div onClick={doRestartGame}>Click to play again</div>}
        </div>
      </>
    );
  }

  if (phase === GamePhase.NOT_STARTED) {
    return (
      <div className="death" onClick={doRestartGame}>
        {isHost ? "Click to start" : "Waiting for host to start"}
      </div>
    );
  }

  if (!selectedCard) {
    return null;
  }

  return (
    <>
      <div>The host is {host?.name}</div>
      <Meters stats={currentStats} />
      <Question card={selectedCard} />
      <div className="answers">
        <NoAnswer text={selectedCard.answer_no || "No"} />
        <div className="answer answer--neutral">
          {answerCountdown && (
            <div className="countdown">{answerCountdown.countdown}...</div>
          )}
        </div>
        <YesAnswer text={selectedCard.answer_yes || "Yes"} />
      </div>
    </>
  );
}
