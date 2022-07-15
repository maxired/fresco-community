import { AnyAction, Store } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import * as sdk from "./sdk";
import { AppState, createStore } from "./store";
import { FC, ReactNode } from "react";
import { PARTICIPANT_INSIDE_TABLE } from "./features/voting/useOnFrescoStateUpdate";

export const mockSdk = (
  sdkOverride: Partial<IFrescoSdk> = {},
  realtimeOverride: RealtimeTables = {}
) => {
  const data: RealtimeTables = {
    ...realtimeOverride,
  };
  jest.spyOn(sdk, "getSdk").mockReturnValue({
    localParticipant: {
      id: "my-id",
      name: "my-name",
    },
    remoteParticipants: [],
    storage: {
      realtime: {
        set: (tableName: string, key: string, value: string) => {
          if (!key || !tableName) {
            return;
          }

          if (!data[tableName]) {
            data[tableName] = {};
          }

          data[tableName][key] = value;
        },
        get: (tableName: string, key: string) => {
          return data[tableName] && data[tableName][key];
        },
        all: (tableName: string) => data[tableName] ?? {},
        clear: (tableName: string) => {
          data[tableName] = {};
        },
        data,
      },
    },
    element: {
      state: { gameUrl: "http://some-url/" },
    },
    subscribeToGlobalEvent: jest.fn(() => () => {}),
    triggerEvent: () => {},
    ...sdkOverride,
  } as unknown as IFrescoSdk);

  // put participants inside the element
  [
    sdk.getSdk().localParticipant.id,
    ...(sdkOverride.remoteParticipants ?? []).map((p) => p.id),
  ].forEach((id) => {
    sdk.getSdk().storage.realtime.set(PARTICIPANT_INSIDE_TABLE, id, true);
  });
};

type PropsWithChildren = {
  children: ReactNode;
};
type MockReduxProviderProps = PropsWithChildren & {
  store: Store<AppState, AnyAction>;
};

const MockReduxProvider: FC<MockReduxProviderProps> = ({ children, store }) => {
  return <Provider store={store}>{children}</Provider>;
};

export const getWrapper =
  (store = createStore()): FC<PropsWithChildren> =>
  ({ children }) =>
    <MockReduxProvider store={store}>{children}</MockReduxProvider>;
