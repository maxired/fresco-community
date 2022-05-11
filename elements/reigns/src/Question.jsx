import React from "react";
import { useSelector } from "react-redux";

export const Question = ({ card }) => {
  const assetsUrl = useSelector((state) => state.game.definition?.assetsUrl);
  return (
      <div className="block question">
        <div className="question__image">
          <img src={`${assetsUrl}/${card.bearer}.png`} />
          {card.bearer}
        </div>
        <div className="question__text">{card.card}</div>
      </div>
    );
  };