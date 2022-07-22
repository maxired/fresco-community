import clsx from "clsx";
import { useRef } from "react";

export const MeterArrow = ({
  className, currentAnimation,
}: {
  className: string;
  currentAnimation: string;
}) => {
  const textRef = useRef("\u00a0"); // default value of insecapable space to have initial height

  if (currentAnimation !== "") {
    let nextText = currentAnimation.includes("--grow") ? "▶" : "◀";
    if (currentAnimation.includes("--big")) {
      nextText += nextText;
    }
    textRef.current = nextText; // no need to ever set back the textRef. This allows fadeout to work
  }

  return (
    <div className={clsx(className, currentAnimation)}>{textRef.current}</div>
  );
};
