import React from "react";
import { useSelector } from "react-redux";
import { AppState, Card } from "./features/game/types";

export const Question = ({ card }: { card: Card | null }) => {
  const assetsUrl = useSelector((state: AppState) => state.game.definition?.assetsUrl);

  if (!card) {
    return null;
  }
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