import { getSdk } from "../../sdk";

export const persistIsMounted = () => {
  const sdk = getSdk();
  sdk.storage.set(
    IS_MOUNTED_TABLE,
    sdk.localParticipant.id,
    sdk.localParticipant.id
  );
  console.log("sending is mounted for", sdk.localParticipant.id);
};
export const persistIsUnMounted = () => {
  const sdk = getSdk();
  const mounted = sdk.storage.get(IS_MOUNTED_TABLE, sdk.localParticipant.id);
  if (mounted) {
    sdk.storage.remove(IS_MOUNTED_TABLE, mounted.id);
  }
};
export const IS_MOUNTED_TABLE = "is-element-mounted";
