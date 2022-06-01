import { useEffect } from "react";

export const useInterval = (
  action: () => void,
  delayInMilliseconds: number,
  deps: any[] = []
) => {
  useEffect(() => {
    const timer = setInterval(() => {
      action();
    }, delayInMilliseconds);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayInMilliseconds, action, ...deps]);
};
