import { reducer, updateHost } from "./hostSlice";
import { IS_MOUNTED_TABLE } from "./persistIsMounted";
import * as determineHost from "./determineHost";
import * as sdk from "../../sdk";
import * as mounted from "./persistIsMounted";

type Storage = { [key: string]: ProtectedStorageItem[] };

const mockSdk = (
  sdkOverride: Partial<IFrescoSdk> = {},
  storageOverride: Storage = {}
) => {
  const { GAME_TABLE, HOST_KEY } = determineHost;
  const storage: Storage = {
    [IS_MOUNTED_TABLE]: [{ id: "id", value: "my-id" } as ProtectedStorageItem],
    [GAME_TABLE]: [
      {
        id: HOST_KEY,
        value: { id: "my-id", name: "my-name" },
      } as ProtectedStorageItem,
    ],
    ...storageOverride,
  };
  jest.spyOn(sdk, "getSdk").mockReturnValue({
    didSyncRemoteParticipants: true,
    localParticipant: {
      id: "my-id",
      name: "my-name",
    },
    remoteParticipants: [],
    element: {
      storage,
    },
    storage: {
      get: (table: typeof GAME_TABLE | typeof IS_MOUNTED_TABLE, key: string) =>
        storage[table].find((p) => p.id === key),
      set: jest.fn(),
    },
    ...sdkOverride,
  } as unknown as IFrescoSdk);
};

describe("hostSlice", () => {
  describe("updateHost", () => {
    it("should not determine host if remote clients not yet synced", () => {
      mockSdk({ didSyncRemoteParticipants: false });
      const spy = jest.spyOn(determineHost, "determineHost");
      reducer({ currentHost: null, isMounted: true }, updateHost());
      expect(spy).not.toBeCalled();
    });
    it("should determine host if remote clients have synced", () => {
      mockSdk({ didSyncRemoteParticipants: true });
      const spy = jest.spyOn(determineHost, "determineHost");
      reducer({ currentHost: null, isMounted: true }, updateHost());
      expect(spy).toBeCalled();
    });

    it("should persist isMounted if not persisted", () => {
      mockSdk(undefined, {
        [IS_MOUNTED_TABLE]: [],
      });
      const spy = jest.spyOn(mounted, "persistIsMounted");
      reducer({ currentHost: null, isMounted: true }, updateHost());
      expect(spy).toBeCalled();
    });
  });
});
