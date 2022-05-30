import { getSdk } from "../../sdk";
import { throttle } from "lodash";

export const IS_MOUNTED_TABLE = "is-element-mounted";

export const persistIsMounted = throttle((isMounted: boolean) => {
  const sdk = getSdk();
  if (isMounted) {
    sdk.storage.realtime.set(IS_MOUNTED_TABLE, sdk.localParticipant.id, true);
  } else {
    sdk.storage.realtime.set(
      IS_MOUNTED_TABLE,
      sdk.localParticipant.id,
      undefined
    );
  }
}, 1000);
