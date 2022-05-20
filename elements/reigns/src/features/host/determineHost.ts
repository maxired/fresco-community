import { getSdk } from "../../sdk";

export const HOST_KEY = "host";
export const GAME_TABLE = "game";
export const determineHost = ({
  mounted,
  remoteParticipants,
  localParticipant,
  currentHost,
}: {
  mounted: ProtectedStorageItem[];
  remoteParticipants: Participant[];
  localParticipant: Participant;
  currentHost: Participant | null;
}) => {
  const mountedIds = mounted.map(({ value }) => value);
  const connectedAndMounted = [...remoteParticipants, localParticipant].filter(
    (p) => mountedIds.includes(p.id)
  );
  const ordered = [...connectedAndMounted].sort((a, b) =>
    a.id.localeCompare(b.id)
  );
  const keepHost =
    currentHost && ordered.map((p) => p.id).includes(currentHost.id);
  console[keepHost ? "log" : "warn"](
    `Mounted: ${mountedIds.join(", ")}`,
    `\nEligible participants: ${JSON.stringify(
      ordered.map((p) => ({ id: p.id, name: p.name }))
    )}`,
    `\nCurrent host: ${currentHost?.name}`,
    `\nChange host: ${keepHost ? "No" : "Yes"}`
  );

  if (keepHost) {
    return currentHost;
  }
  const newHost = ordered[0];
  if (!newHost) console.warn("There is no eligible host");

  if (newHost && newHost.id === localParticipant.id) {
    const { storage } = getSdk();
    storage.set(GAME_TABLE, HOST_KEY, {
      name: localParticipant.name,
      id: localParticipant.id,
    });
  }
  return ordered[0];
};
