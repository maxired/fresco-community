import { getSdk } from "../../sdk";

const HOST_TABLE = "host";
export const determineHost = ({
  mounted,
  remoteParticipants,
  localParticipant,
  previousHost,
}: {
  mounted: ProtectedStorageItem[];
  remoteParticipants: Participant[];
  localParticipant: Participant;
  previousHost: Participant | null;
}) => {
  const mountedIds = mounted.map(({ value }) => value);
  const connectedAndMounted = [...remoteParticipants, localParticipant].filter(
    (p) => mountedIds.includes(p.id)
  );
  const ordered = [...connectedAndMounted].sort((a, b) =>
    a.id.localeCompare(b.id)
  );
  if (previousHost && ordered.map((p) => p.id).includes(previousHost.id)) {
    return previousHost;
  }
  const newHost = ordered[0];

  if (newHost && newHost.id === localParticipant.id) {
    const { storage } = getSdk();
    storage.clear(HOST_TABLE);
    storage.add(HOST_TABLE, {
      name: localParticipant.name,
      id: localParticipant.id,
    });
  }
  return ordered[0];
};
