import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "./store";

export const Meter = ({
  src,
  percent,
  name,
}: {
  src: string;
  percent: number;
  name: string;
}) => {
  const assetsUrl = useSelector(
    (state: AppState) => state.game.definition?.assetsUrl
  );

    const [currentAnimation, setCurrentAnimation] = useState("");
    const [trailingPercent, setTrailingPercent] = useState(percent);
    const previousPercent = useRef(0);

    useEffect(() => {
        // Whenever percent changes, we want to add a class
        // to the meter element to make it change color
        if (percent > previousPercent.current) {
            setCurrentAnimation("meter__icon--grow");
            setTrailingPercent(percent);
        } else {
            setCurrentAnimation("meter__icon--shrink");
            setTrailingPercent(previousPercent.current);
        }

        const timeout = setTimeout(() => {
            setCurrentAnimation("");
            // css animation is .5s
            // we wait 1s so that the color lingers a bit longer
        }, 2000);
        
        previousPercent.current = percent;
        return () => clearTimeout(timeout);
    }, [percent]);
  
  return (
    <div className="meter">
      <div className={clsx("meter__icon", currentAnimation)}>
        <div className="meter__percent percent--trail" style={{ height: trailingPercent + "%" }} />
        <div className="meter__percent" style={{ height: percent + "%" }} />
        <img src={`${assetsUrl}/${src}`} />
      </div>
      <div className="meter__name">{name}</div>
    </div>
  );
};
