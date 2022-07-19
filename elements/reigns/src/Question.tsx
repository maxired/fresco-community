import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import textfit from "textfit";

import { Card } from "./features/game/types";
import { AppState } from "./store";

export const Question = ({ card }: { card: Card | null }) => {
  const assetsUrl = useSelector(
    (state: AppState) => state.game.definition?.assetsUrl
  );

  const domCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!card || !domCardRef.current) {
      return;
    }

    domCardRef.current.innerHTML = `${card.card}`; // textfit will modify the dom node. We don't want React to also modify it's content to prevent conflict
    textfit(domCardRef.current, {
      alignHoriz: false,
      alignVert: true,
      reProcess: true,
      multiLine: true,
      maxFontSize: 1000,
    });
  }, [card?.card]);

  const fadeQuestion = useSelector((state: AppState) => state.transition.question)

  if (!card?.card) {
    return null;
  }

  return (
    <div className={clsx('block question fade', !fadeQuestion && 'fade--in')}>
      <div className="question__image">
        <div
          className="question__image_img"
          style={{ "--url": `url(${assetsUrl}/${card.bearer}.png)` } as any}
        />
        <div className="question__bearer">{card.bearer}</div>
      </div>
      <div className="question__text-wrap" ref={domCardRef} />
    </div>
  );
};
