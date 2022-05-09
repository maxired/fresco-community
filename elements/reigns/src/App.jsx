import React, { useEffect } from "react";
import cards from "./cards.json";
import { GameEngine } from "./GameEngine";

const gameDefinition = {
  deathMessage: 'You have been fired!',
  stats: [
    {
      name: "End user",
      icon: "./noun-crowd-2383331.svg",
      value: 50,
    },
    {
      name: "Boss",
      icon: "./noun-coins-1123601.svg",
      value: 50,
    },
    {
      name: "European commission",
      icon: "./noun-sword-fighting-2054626.svg",
      value: 50,
    },
  ],
  cards,
};
const gameEngine = new GameEngine(gameDefinition);

const Meter = ({ src, percent }) => {
  return (
    <div className="meter">
      <div className="meter__percent" style={{ height: percent + "%" }} />
      <img src={src} />
    </div>
  );
};

const Meters = ({ stats }) => {
  return (
    <div className="block meters">
      {stats.map((stat) => (
        <Meter key={stat.icon} src={stat.icon} percent={stat.value} />
      ))}
    </div>
  );
};

const Question = ({ card }) => {
  return (
    <div className="block question">
      <div className='question__image'>
        <img src={`/${card.bearer}.png`} />
        {card.bearer}
      </div>
      <div className="question__text">{card.card}</div>
    </div>
  );
};
const YesAnswer = ({ text, onClick }) => {
  return (
    <div className="answer answer--yes" onClick={onClick}>
      <div className="answer__zone"></div>
      <div className="answer__text">{text}</div>
    </div>
  );
};

const NeutralZone = () => {
  return <div className="answer answer--neutral" />;
};

const NoAnswer = ({ text, onClick }) => {
  return (
    <div className="answer answer--no" onClick={onClick}>
      <div className="answer__zone"></div>
      <div className="answer__text">{text}</div>
    </div>
  );
};

export default function App() {
  const [currentCard, setCard] = React.useState();
  const [isDead, setIsDead] = React.useState(false);
  const [currentStats, setStats] = React.useState();

  const updateGameState = () => {
    const gameState = gameEngine.getState();
    setCard(gameState.selectedCard);
    // BUG: Useless to set stats as it is always the same object
    setStats(gameState.stats);
    setIsDead(gameState.isDead);
  };

  useEffect(updateGameState, []);

  const answerNo = () => {
    gameEngine.answerNo();
    updateGameState();
  };
  const answerYes = () => {
    gameEngine.answerYes();
    updateGameState();
  };

  if (isDead) {
    return <div className='death'>{gameDefinition.deathMessage}</div>;
  }

  if (!currentCard) {
    return null;
  }


  return (
    <>
      <Meters stats={currentStats} />
      <Question card={currentCard} />
      <div className="answers">
        <NoAnswer text={currentCard.answer_no || "No"} onClick={answerNo} />
        <NeutralZone />
        <YesAnswer text={currentCard.answer_yes || "Yes"} onClick={answerYes} />
      </div>
    </>
  );
}
