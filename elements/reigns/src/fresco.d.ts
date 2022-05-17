interface IToolbarButton {
  title: string;
  ui: { type: string };
  property: string;
}

interface IInitializeOptions {
  title: string;
  toolbarButtons: IToolbarButton[];
}

type AppearanceValue =
  | string
  | number
  | boolean
  | Record<string, AppearanceValue>;

interface IFrescoSdk {
  onReady(callback: () => void): void;
  onStateChanged(callback: () => void): void;
  subscribeToGlobalEvent(
    eventName: string,
    handler: (event: any) => void
  ): () => void;
  element: {
    state: any;
    id: string;
    name: string;
    appearance: Record<string, AppearanceValue>;
    storage: Records<string, AppearanceValue[]>;
  };
  localParticipant: {
    id: string;
    identityId: string;
    isInsideElement: boolean;
  };
  remoteParticipants: {
    ids: string[];
  };
  setState(state: any): void;
  storage: {
    add: (tableName: string, value: AppearanceValue) => void;
    remove: (tableName: string, id: string) => void;
  };
  initialize(defaultState: any, options: IInitializeOptions): void;
  send(action: { type: string; payload: any }): void;
}

declare var fresco: IFrescoSdk;
