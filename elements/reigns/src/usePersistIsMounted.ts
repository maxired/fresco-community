import { useEffect } from "react";

export const IS_MOUNTED_TABLE = "is-element-mounted";
export const usePersistIsMounted = () => {
  useEffect(() => {
    const dispatchIsMounted = () =>
      fresco.storage.add(IS_MOUNTED_TABLE, fresco.localParticipant.id);
    const dispatchIsUnmounted = () => {
      fresco.element.storage[IS_MOUNTED_TABLE].filter(
        (p) => p.value === fresco.localParticipant.id
      ).forEach(({ id }) => {
        fresco.storage.remove(IS_MOUNTED_TABLE, id);
      });
    };

    dispatchIsMounted();

    document.addEventListener("visibilitychange", () => {
      const isVisible = document?.visibilityState === "visible";
      if (isVisible) {
        dispatchIsMounted();
      } else {
        dispatchIsUnmounted();
      }
    });
    return () => {
      dispatchIsUnmounted();
    };
  }, []);
};
