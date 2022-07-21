import { getSdk } from "../../sdk";

export const teleport = (target: string, targetPrefix?: string) => {
  const sdk = getSdk();
  if (sdk.element.appearance) {
    const defaultTargetPrefix = `${sdk.element.appearance.NAME}-`;
    sdk.send({
      type: "extension/out/redux",
      payload: {
        action: {
          type: "TELEPORT",
          payload: {
            anchorName: `${targetPrefix ?? defaultTargetPrefix}${target}`,
          },
        },
      },
    });
  }
};
