import { getSdk } from "../../sdk";
import { GAME_TABLE } from "../game/Game";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";

export const ROUND_RESOLUTION_KEY = "round-resolution";
export const PARTICIPANT_VOTE_TABLE = "participants-vote";

export type Answer = "Yes" | "No";

export type GameVote = { answer: Answer | null; countdown: number | null };

export const getGameVote = () => {
  const result = (getSdk().storage.realtime.get(
    GAME_TABLE,
    ROUND_RESOLUTION_KEY
  ) ?? {}) as GameVote;
  return result;
};

export const persistGameVote = (value: GameVote | null) => {
  getSdk().storage.realtime.set(
    GAME_TABLE,
    ROUND_RESOLUTION_KEY,
    value || undefined
  );
  return value;
};

export type ParticipantVote = Participant & { answer: Answer | null };

export const getParticipantVotes = (): ParticipantVote[] => {
  const sdk = getSdk();
  const connectedPlayers = [
    { id: sdk.localParticipant.id, name: sdk.localParticipant.name },
    ...sdk.remoteParticipants,
  ];
  const playersInsideExtension = connectedPlayers.filter((p) =>
    sdk.storage.realtime.get(PARTICIPANT_INSIDE_TABLE, p.id)
  );
  const votes = playersInsideExtension.map((participant) => {
    return {
      ...participant,
      answer: sdk.storage.realtime.get(
        PARTICIPANT_VOTE_TABLE,
        participant.id
      ) as Answer | null,
    };
  });
  return votes;
};

export const persistParticipantVote = (
  participantId: string,
  answer: Answer | null
) => {
  const sdk = getSdk();
  console.warn("Setting vote to", answer);
  sdk.storage.realtime.set(
    PARTICIPANT_VOTE_TABLE,
    participantId,
    answer ?? null
  );
};
