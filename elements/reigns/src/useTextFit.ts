import { useEffect, useRef } from "react";
import textfit from "textfit";

export const useTextFit = (text: string | undefined, maxFontSize = 1000) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.innerHTML = `${text}`; // textfit will modify the dom node. We don't want React to also modify it's content to prevent conflict
    textfit(ref.current, {
      alignHoriz: false,
      alignVert: true,
      reProcess: true,
      multiLine: true,
      maxFontSize,
    });
  }, [ref, text]);
  return ref;
};
