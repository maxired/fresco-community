import { ROUND_RESOLUTION_KEY, GameVote } from "./votingSlice";
import { getSdk } from "../../sdk";
import { GAME_TABLE } from "../game/Game";

export const persistAnswer = (value: GameVote | null) => {
  getSdk().storage.realtime.set(
    GAME_TABLE,
    ROUND_RESOLUTION_KEY,
    value || undefined
  );
  return value;
};
