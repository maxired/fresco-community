import { MutableRefObject, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateGame } from "../game/gameSlice";
import { getSdk } from "../../sdk";
import { PersistedState } from "../game/types";
import { frescoUpdate } from "../host/hostSlice";
import { updateVote } from "./votingSlice";

export const PARTICIPANT_INSIDE_TABLE = "participants-inside";

export const useOnFrescoStateUpdate = () => {
  const dispatch = useDispatch();
  const prevLocalParticipantRef = useRef<{
    id: string | null;
    isInsideElement: boolean | null;
  }>({ id: null, isInsideElement: null });
  return () => {
    const sdk = getSdk();
    const state: PersistedState = sdk.element.state;

    dispatch(updateGame(state));
    dispatch(frescoUpdate());
    dispatch(updateVote());

    persistIsInsideElement(prevLocalParticipantRef);
  };
};

const persistIsInsideElement = (
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
    sdk.storage.set(
      PARTICIPANT_INSIDE_TABLE,
      sdk.localParticipant.id,
      sdk.localParticipant.isInsideElement
    );
    prevLocalParticipantRef.current = {
      ...sdk.localParticipant,
    };
  }
};
