import { getSdk } from "../../sdk";
import { throttle } from "lodash";

export const IS_MOUNTED_TABLE = "is-element-mounted";

export const persistIsMounted = throttle((isMounted: boolean) => {
  const sdk = getSdk();
  if (isMounted) {
    sdk.storage.set(IS_MOUNTED_TABLE, sdk.localParticipant.id, true);
    console.log("Sending is mounted for", sdk.localParticipant.id);
  } else {
    sdk.storage.remove(IS_MOUNTED_TABLE, sdk.localParticipant.id);
  }
}, 1000);
