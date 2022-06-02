import { AnyAction, Store } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import * as sdk from "../../sdk";
import { AppState } from "../../store";
import React from "react";

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
        all: (tableName: string) => data[tableName],
        clear: (tableName: string) => {
          data[tableName] = {};
        },
        data,
      },
    },
    ...sdkOverride,
  } as unknown as IFrescoSdk);
};
