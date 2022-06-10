import React from "react";
import { useSelector } from "react-redux";
import { Card } from "./features/game/types";
import { AppState } from "./store";

export const Question = ({ card }: { card: Card | null }) => {
  const assetsUrl = useSelector(
    (state: AppState) => state.game.definition?.assetsUrl
  );

  if (!card) {
    return null;
  }
  return (
    <div className="block question">
      <div className="question__image" >
        <div className="question__image_img"  style={{ '--url': `url(${assetsUrl}/${card.bearer}.png)`} as any} />
        <div className='question__bearer'>{card.bearer}</div>
      </div>
      <div className='question__text-wrap'>
        <div className="question__text">{card.card}</div>
      </div>
    </div>
  );
};
