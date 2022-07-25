import clsx from "clsx";
import { useSelector } from "react-redux";
import { useRoundedRectangleProgress } from "./features/voting/useRoundedRectangleProgress";
import { AppState } from "./store";

type Props = {
  text: string;
  answer: "yes" | "no";
  progress: number;
  color: string;
  votesMissing: number | null;
};

export const AnswerArea = ({
  text,
  answer,
  progress,
  votesMissing,
  color,
}: Props) => {
  const isChangingRound = useSelector(
    (state: AppState) => state.transition.round
  );

  const ref = useRoundedRectangleProgress(
    progress,
    color,
    progress === 1,
    !isChangingRound
  );

  const fadeAnswer = useSelector((state: AppState) => state.transition.answer);

  return (
    <div className="answer">
      <div className="answer__text-outer-container">
        <div className="answer__text-inner-container">
          <div
            ref={ref}
            id={`${answer}-answer-background`}
            className={clsx("fade", { "fade--in": !fadeAnswer })}
          >
            <div className="answer__text">{text}</div>
          </div>
        </div>
        <div
          className={clsx(
            "answer__votes-missing fade",
            !fadeAnswer && "fade--in"
          )}
          data-testid={`${answer}-votes-missing`}
        >
          {!!votesMissing && votesMissing < 4 && (
            <span>{getVotesMissingMessage(votesMissing)}</span>
          )}
        </div>
      </div>
      <div className={`answer__zone answer--${answer}`}></div>
    </div>
  );
};

const getVotesMissingMessage = (votesMissing: number) => {
  if (votesMissing === 1) return "1 vote missing";
  return `${votesMissing} votes missing`;
};
