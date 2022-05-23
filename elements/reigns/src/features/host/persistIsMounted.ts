import { getSdk } from "../../sdk";
import { throttle } from "lodash";

export const IS_MOUNTED_TABLE = "is-element-mounted";

export const persistIsMounted = throttle((isMounted: boolean) => {
  const sdk = getSdk();
  if (isMounted) {
    sdk.storage.set(IS_MOUNTED_TABLE, sdk.localParticipant.id, true);
    console.log("sending is mounted for", sdk.localParticipant.id);
  } else {
    const mounted = sdk.storage.get(IS_MOUNTED_TABLE, sdk.localParticipant.id);
    if (mounted) {
      sdk.storage.remove(IS_MOUNTED_TABLE, mounted.id);
    }
  }
}, 1000);
