import clsx from "clsx";
import { useSelector } from "react-redux";

import { Card } from "./features/game/types";
import { AppState } from "./store";
import { useTextFit } from "./useTextFit";

export const Question = ({ card }: { card: Card | null }) => {
  const assetsUrl = useSelector(
    (state: AppState) => state.game.definition?.assetsUrl
  );

  const ref = useTextFit(card?.card);

  const fadeQuestion = useSelector(
    (state: AppState) => state.transition.question
  );

  if (!card?.card) {
    return null;
  }

  return (
    <div className={clsx("block question fade", !fadeQuestion && "fade--in")}>
      <div className="question__image">
        <div
          className="question__image_img"
          style={{ "--url": `url(${assetsUrl}/${card.bearer}.png)` } as any}
        />
        <div className="question__bearer">{card.bearer}</div>
      </div>
      <div className="question__text-wrap" ref={ref} />
    </div>
  );
};
