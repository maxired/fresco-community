/*
  null - countdown stopped / unstarted
     5 - countdown start
     4
     3
     2
     1 - vote may be reset until here
     0 - votes are locked, begin teleport
    -1 - teleport considered complete, begin next round
    -2 - error state in case something went wrong, begin next round
*/
const START = 5;
const LOCK_START = 0;
const LOCK_END = LOCK_START - 1;

export class Countdown {
  public get value(): number | null {
    return this._value;
  }

  get isPastValidRange() {
    return this.isStarted && this._value! < LOCK_END;
  }

  get isLocked() {
    return this.isStarted && this._value! <= LOCK_START;
  }

  get wasJustLocked() {
    return this.isStarted && this._value! === LOCK_START;
  }

  get isStarted() {
    return typeof this._value === "number";
  }

  get isVoting() {
    return this.isStarted && this._value! > LOCK_START;
  }

  get notStarted() {
    return this.value === null;
  }

  static from(value: number | null) {
    return new Countdown(value);
  }

  constructor(private _value: number | null = null) {}

  stop() {
    this._value = null;
    return this;
  }

  start() {
    this._value = START;
    return this;
  }

  lock() {
    this._value = LOCK_START;
    return this;
  }

  increment() {
    if (this.isStarted) {
      this._value = this._value! + 1;
    }
    return this;
  }

  decrement() {
    if (this.isStarted) {
      this._value = this._value! - 1;
    }
    return this;
  }
}
