import { MutableRefObject } from "react";
import { getSdk } from "../../sdk";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";

export const persistIsInsideElement = (
  prevLocalParticipantRef: MutableRefObject<{
    id: string | null;
    isInsideElement: boolean | null;
  }>
) => {
  const sdk = getSdk();
  if (
    sdk.localParticipant.id !== prevLocalParticipantRef.current.id ||
    sdk.localParticipant.isInsideElement !==
      prevLocalParticipantRef.current.isInsideElement
  ) {
    sdk.storage.realtime.set(
      PARTICIPANT_INSIDE_TABLE,
      sdk.localParticipant.id,
      sdk.localParticipant.isInsideElement
    );
    prevLocalParticipantRef.current = {
      ...sdk.localParticipant,
    };
  }
};
