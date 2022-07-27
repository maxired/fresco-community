import { persistParticipantVote } from "./features/voting/persistence";
import { PARTICIPANT_INSIDE_TABLE } from "./features/voting/useOnFrescoStateUpdate";
import { getSdk } from "./sdk";

export const mockSdkVote = (answer: "yes" | "no") => {
  const sdk = getSdk();
  if (!sdk.isMockSdk) return;

  sdk.storage.realtime.set(
    PARTICIPANT_INSIDE_TABLE,
    sdk.localParticipant.id,
    true
  );
  persistParticipantVote(
    sdk.localParticipant.id,
    answer === "yes" ? "Yes" : "No"
  );
};
