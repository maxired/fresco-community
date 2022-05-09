import React, { useEffect } from "react";
import cards from "./cards.json";
import { GameEngine } from "./GameEngine";

const gameDefinition = {
  stats: [
    {
      name: "religion",
      icon: "./noun-religion-3562673.svg",
      value: 50,
    },
    {
      name: "military",
      icon: "./noun-sword-fighting-2054626.svg",
      value: 50,
    },
    {
      name: "populace",
      icon: "./noun-crowd-2383331.svg",
      value: 50,
    },
    {
      name: "money",
      icon: "./noun-coins-1123601.svg",
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
      <img className="question__image" src={`/${card.bearer}.png`} />
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
  const [currentStats, setStats] = React.useState();

  const updateGameState = () => {
    console.log('here');
    const gameState = gameEngine.getState();
    setCard(gameState.selectedCard);
    setStats(gameState.stats);
  };

  useEffect(updateGameState, []);

  const answerNo = () => {
    console.log("NO");
    gameEngine.answerNo();
    updateGameState();
  };
  const answerYes = () => {
    console.log("YES");
    gameEngine.answerYes();
    updateGameState();
  };

  if (!currentCard) {
    return null;
  }

  return (
    <>
      <Meters stats={currentStats} />
      <Question card={currentCard} />
      <div className="answers">
        <NoAnswer text={currentCard.no ?? "No"} onClick={answerNo} />
        <NeutralZone />
        <YesAnswer text={currentCard.yes ?? "Yes"} onClick={answerYes} />
      </div>
    </>
  );
}
