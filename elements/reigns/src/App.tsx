import React, { useEffect } from "react";
import { Meters } from "./Meters";
import { Question } from "./Question";
import { NoAnswer } from "./NoAnswer";
import { YesAnswer } from "./YesAnswer";
import { useSelector, useDispatch } from "react-redux";
import {
  answerNo,
  answerYes,
  initializeGame,
  startGame,
} from "./features/game/gameSlice";
import { GamePhase, Loading } from "./constants";
import { useFresco } from "./useFresco";
import { usePersistIsMounted } from "./features/host/usePersistIsMounted";
import { AppState } from "./store";

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

  const { updateFrescoState, teleport, sdkLoaded } = useFresco();

  usePersistIsMounted(sdkLoaded);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!gameUrl) {
      return;
    }
    dispatch(initializeGame(gameUrl) as any);
  }, [gameUrl]);

  const isHost = host && fresco.localParticipant.id === host?.id;

  const doAnswerNo = () => {
    // TODO: host will call this in FRES-1112
    if (isHost) {
      dispatch(answerNo());
      updateFrescoState();
      // TODO: teleport everyone
      teleport("neutral");
    }
  };

  const doAnswerYes = () => {
    // TODO: host will call this in FRES-1112
    if (isHost) {
      dispatch(answerYes());
      updateFrescoState();
      // TODO: teleport everyone
      teleport("neutral");
    }
  };

  useEffect(() => {
    if (phase === GamePhase.STARTED) {
      const yesListener = fresco.subscribeToGlobalEvent(
        "custom.reign.yes",
        () => {
          doAnswerYes();
        }
      );

      const noListener = fresco.subscribeToGlobalEvent(
        "custom.reign.no",
        () => {
          doAnswerNo();
        }
      );

      return () => {
        yesListener();
        noListener();
      };
    }
  }, [phase]);

  const doRestartGame = () => {
    if (isHost) {
      dispatch(startGame());
      updateFrescoState();
    }
  };

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
          <YesAnswer text="Play again" onClick={doRestartGame} />
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
        <NoAnswer text={selectedCard.answer_no || "No"} onClick={doAnswerNo} />
        <div className="answer answer--neutral" />
        <YesAnswer
          text={selectedCard.answer_yes || "Yes"}
          onClick={doAnswerYes}
        />
      </div>
    </>
  );
}
