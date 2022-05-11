import React, { useEffect } from "react";
import { Meters } from "./Meters";
import { Question } from "./Question";
import { NoAnswer } from "./NoAnswer";
import { YesAnswer } from "./YesAnswer";
import { useSelector, useDispatch, useStore } from "react-redux";
import { answerNo, answerYes, initializeGame, startGame, updateGame  } from "./features/game/gameSlice";
import { GamePhase } from "./constants";
import { IAppState } from "./features/game/types";

const useFresco = function () {
  const dispatch = useDispatch();

  useEffect(() => {
    fresco.onReady(function () {
      fresco.onStateChanged(function () {
        const state = fresco.element.state;
        console.log("onStateChanged", state);
        dispatch(updateGame(state));
      });

      const defaultState = {
        selectedCard: null,
        phase: GamePhase.LOADING,
        stats: [],
        gameUrl: 'https://localhost:3001/games/gdpr.json',
      };

      fresco.initialize(defaultState, { 
        title: "Reigns", 
        toolbarButtons: [
        {
          title: "Game url",
          ui: { type: "string" },
          property: "gameUrl",
        }]});
    });
  }, []);

  const store = useStore();
  const updateFrescoState = () => {
    const state = store.getState() as IAppState;
    console.log("updateFrescoGameState", state);
    fresco.setState({
      phase: state.game.phase,
      selectedCard: state.game.selectedCard,
      stats: state.game.stats,
    });
  };
  return updateFrescoState;
};

export default function App() {
  const phase = useSelector((state: IAppState) => state.game.phase);
  const selectedCard = useSelector((state: IAppState) => state.game.selectedCard);
  const currentStats = useSelector((state: IAppState) => state.game.stats);
  const gameUrl = useSelector((state: IAppState) => state.game.gameUrl);
  const gameDefinition = useSelector((state: IAppState) => state.game.definition);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (!gameUrl) {
      return;
    }
    dispatch(initializeGame(gameUrl) as any);
  }, [gameUrl]);
  const updateFrescoState = useFresco();

  const doAnswerNo = () => {
    dispatch(answerNo());
    updateFrescoState();
  };
  const doAnswerYes = () => {
    dispatch(answerYes());
    updateFrescoState();
  };
  const doStartGame = () => {
    dispatch(startGame());
    updateFrescoState();
  };

  if (phase === GamePhase.LOADING) {
    return (
      <div className="death">
        Loading...
      </div>
    );
  }

  if (phase === GamePhase.ERROR) {
    return (
      <div className="death">
        ERROR :(
      </div>
    );
  }

  if (phase === GamePhase.ENDED) {
    return (
      <div className="death" onClick={doStartGame}>
        {gameDefinition?.deathMessage}
      </div>
    );
  }

  if (phase === GamePhase.NOT_STARTED) {
    return (
      <div className="death" onClick={doStartGame}>
        Click to start
      </div>
    );
  }

  if (!selectedCard) {
    return null;
  }

  return (
    <>
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
