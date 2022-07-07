import { Answer } from "./votingSlice";
import { getSdk } from "../../sdk";
import { PARTICIPANT_INSIDE_TABLE } from "./useOnFrescoStateUpdate";
import { PARTICIPANT_VOTE_TABLE } from "./useVoteListener";

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
