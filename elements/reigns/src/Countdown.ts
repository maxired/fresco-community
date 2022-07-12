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

export class Countdown {
  static START = 5;
  static LOCKED = 0;

  public get value(): number | null {
    return this._value;
  }

  get isPastValidRange() {
    return this.isStarted && this._value! < Countdown.LOCKED - 1;
  }

  get isLocked() {
    return this.isStarted && this._value! <= Countdown.LOCKED;
  }

  get isLockedStart() {
    return this.isStarted && this._value! === Countdown.LOCKED;
  }

  get isTeleporting() {
    return this.isStarted && this._value! < Countdown.LOCKED;
  }

  get isStarted() {
    return typeof this._value === "number";
  }

  get isVoting() {
    return this.isStarted && this._value! > Countdown.LOCKED;
  }

  get notStarted() {
    return this.value === null;
  }

  static from(value: number | null) {
    return new Countdown(value);
  }

  constructor(private _value: number | null) {}

  stop() {
    this._value = null;
  }

  start() {
    this._value = Countdown.START;
    return this.value;
  }

  lock() {
    this._value = Countdown.LOCKED;
  }

  increment() {
    if (this.isStarted) {
      this._value = this._value! + 1;
    }
  }

  decrement() {
    if (this.isStarted) {
      this._value = this._value! - 1;
    }
  }
}
