import { mockSdkVote } from "./mockSdkVote";

export const AnswerArea = ({ answer }: { answer: "yes" | "no" }) => {
  return (
    <div className="answer">
      <div
        className={`answer__zone answer--${answer}`}
        onClick={() => mockSdkVote(answer)}
      ></div>
    </div>
  );
};
