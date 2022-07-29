import { DEBUG } from "./constants";
export namespace Logger {
  export enum Keys {
    RoundVote,
    PlayerVote,
  }
  let cache: Record<string, string> = {};
  export const VOTE = "VOTE";
  export const HOST = "HOST";
  export const TRANSITION = "TRANSITION";
  export function log(category: string, ...args: any[]) {
    if (DEBUG) {
      console.log(`[${category}]`, ...args);
    }
  }
  export function logIfDifferent(key: Keys, category: string, message: string) {
    if (DEBUG && cache[key] !== message) {
      cache[key] = message;
      log(category, message);
    }
  }

  export function warn(category: string, ...args: any[]) {
    console.warn(`[${category}]`, ...args);
  }
}
