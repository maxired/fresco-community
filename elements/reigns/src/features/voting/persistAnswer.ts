import { ROUND_RESOLUTION_KEY, VotingState } from "./votingSlice";
import { getSdk } from "../../sdk";
import { GAME_TABLE } from "../game/Game";

export const persistAnswer = (value: VotingState | null) => {
  getSdk().storage.realtime.set(
    GAME_TABLE,
    ROUND_RESOLUTION_KEY,
    value || undefined
  );
  return value;
};
