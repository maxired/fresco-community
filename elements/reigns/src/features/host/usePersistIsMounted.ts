import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMounted } from "./hostSlice";

export const usePersistIsMounted = (sdkLoaded: boolean) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sdkLoaded) return;

    dispatch(setMounted(true));

    document.addEventListener("visibilitychange", () => {
      const isVisible = document?.visibilityState === "visible";
      if (isVisible) {
        dispatch(setMounted(true));
      } else {
        dispatch(setMounted(false));
      }
    });
    return () => {
      dispatch(setMounted(false));
    };
  }, [sdkLoaded]);
};
