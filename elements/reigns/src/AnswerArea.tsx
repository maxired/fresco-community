import { useRoundedRectangleProgress } from "./features/voting/useRoundedRectangleProgress";

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
  const ref = useRoundedRectangleProgress(progress, color);

  return (
    <div className="answer">
      <div className="answer__text-outer-container">
        <div className="answer__text-inner-container">
          <div ref={ref} id={`${answer}-answer-background`}>
            <div className="answer__text" style={{ zIndex: 10 }}>
              {text}
            </div>
          </div>
        </div>
        <div className="answer__votes-missing" data-testid={`${answer}-votes-missing`}>
          {!!votesMissing && votesMissing < 4 && <span>{votesMissing} votes missing</span>}
        </div>
      </div>
      <div className={`answer__zone answer--${answer}`}></div>
    </div>
  );
};
