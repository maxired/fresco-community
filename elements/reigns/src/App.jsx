import React from "react";
import cards from "./gdpr/cards.json";
import gameDefinition from "./gdpr/game-definition.json";
import { GameEngine } from "./GameEngine";
import { Meters } from "./Meters";
import { Question } from "./Question";
import { NoAnswer } from "./NoAnswer";
import { YesAnswer } from "./YesAnswer";

const gameEngine = new GameEngine({...gameDefinition, cards });

const useFresco = function (setCard, setIsDead, setStats) {
  fresco.onReady(function () {
    fresco.onStateChanged(function () {
      const state = fresco.element.state;
      console.log('state changed', state);
      
      const gameState = gameEngine.getState();
      if (gameState.isDead !== state.isDead || !gameState.selectedCard || gameState.selectedCard?.card !== state.selectedCard?.card) {
        console.log('state set', state);
        gameEngine.setState(state);
        setCard(state.selectedCard);
        setIsDead(state.isDead);
        setStats(state.stats);  
      }

    });

    const defaultState = {
      selectedCard: null,
      isDead: false,
      stats: []
    };

    fresco.initialize(defaultState, {
      title: "Reigns"
    });
  });
};

export default function App() {
  const [currentCard, setCard] = React.useState();
  const [isDead, setIsDead] = React.useState(false);
  const [currentStats, setStats] = React.useState([]);

  useFresco(setCard, setIsDead, setStats);

  const updateGameState = () => {
    const gameState = gameEngine.getState();
    console.log('updateGameState', gameState);
    fresco.setState({ selectedCard: gameState.selectedCard, isDead: gameState.isDead, stats: gameState.stats });
    setCard(gameState.selectedCard);
    setIsDead(gameState.isDead);
    setStats(gameState.stats);  
};

  const answerNo = () => {
    console.log('no');
    gameEngine.answerNo();
    updateGameState();
  };
  const answerYes = () => {
    console.log('yes');
    gameEngine.answerYes();
    updateGameState();
  };

  if (isDead) {
    return <div className="death">{gameDefinition.deathMessage}</div>;
  }

  if (!currentCard) {
    return <div className="death" onClick={updateGameState}>Click to start</div>;
  }

  return (
    <>
      <Meters stats={currentStats} />
      <Question card={currentCard} />
      <div className="answers">
        <NoAnswer text={currentCard.answer_no || "No"} onClick={answerNo} />
        <div className="answer answer--neutral" />
        <YesAnswer text={currentCard.answer_yes || "Yes"} onClick={answerYes} />
      </div>
    </>
  );
}
