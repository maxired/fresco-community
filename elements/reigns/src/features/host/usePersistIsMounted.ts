import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMounted } from "./hostSlice";

export const usePersistIsMounted = (sdkLoaded: boolean) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sdkLoaded) return;

    dispatch(setMounted(true));

    const onVisibilityChange = () => {
      const isVisible = document?.visibilityState === "visible";
      if (isVisible) {
        dispatch(setMounted(true));
      } else {
        dispatch(setMounted(false));
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      dispatch(setMounted(false));
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [sdkLoaded]);
};
