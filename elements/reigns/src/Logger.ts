import { DEBUG } from "./constants";

export namespace Logger {
  export const VOTE = "VOTE";
  export const HOST = "HOST";
  export const TRANSITION = "TRANSITION";
  export function log(category: string, ...args: any[]) {
    if (DEBUG) {
      console.log(`[${category}]`, ...args);
    }
  }
  export function warn(category: string, ...args: any[]) {
    console.warn(`[${category}]`, ...args);
  }
}
