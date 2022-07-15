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
  console.log("maxired progress is", progress);
  const ref = useRoundedRectangleProgress(progress, color, progress === 1);

  return (
    <div className="answer">
      <div className="answer__text-outer-container">
        <div className="answer__text-inner-container">
          <div ref={ref} id={`${answer}-answer-background`}>
            <div className="answer__text">{text}</div>
          </div>
        </div>
        <div
          className="answer__votes-missing"
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
