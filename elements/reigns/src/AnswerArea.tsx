import React, { useRef } from "react";
import { useRoundedRectangleProgress } from "./features/voting/useRoundedRectangleProgress";

export const AnswerArea = ({
  text,
  answer,
  progress,
  color,
}: {
  text: string;
  answer: "yes" | "no";
  progress: number;
  color: string;
}) => {
  const ref = useRoundedRectangleProgress(progress, color);

  return (
    <div className="answer">
      <div className="answer__text-container">
          <div ref={ref} id={`${answer}-answer-background`}>
          <span className="answer__text" style={{ zIndex: 10 }}>
            {text}
          </span>
        </div>
      </div>
      <div className={`answer__zone answer--${answer}`}></div>
    </div>
  );
};
