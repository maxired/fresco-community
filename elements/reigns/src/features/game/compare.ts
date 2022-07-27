export const equal = (a: string, b: string) => a === b;
export const notEqual = (a: number, b: number) => a != b;
export const biggerOrEqual = (a: number, b: number) => a >= b;
export const lowerOrEqual = (a: number, b: number) => a <= b;
export const biggerThan = (a: number, b: number) => a > b;
export const lowerThan = (a: number, b: number) => a < b;

export enum CONDITION_KEY_VALUE_SEPARATORS {
  EQUAL_SEPARATOR = "==",
  NOT_EQUAL_SEPARATOR = "!=",
  BIGGER_OR_EQUAL_SEPARATOR = ">=",
  LOWER_OR_EQUAL_SEPARATOR = "<=",
  BIGGER_THAN_SEPARATOR = ">",
  LOWER_THAN_SEPARATOR = "<",
}

const COMPARE_OPERATIONS = {
  [CONDITION_KEY_VALUE_SEPARATORS.NOT_EQUAL_SEPARATOR]: notEqual,
  [CONDITION_KEY_VALUE_SEPARATORS.BIGGER_OR_EQUAL_SEPARATOR]: biggerOrEqual,
  [CONDITION_KEY_VALUE_SEPARATORS.LOWER_OR_EQUAL_SEPARATOR]: lowerOrEqual,
  [CONDITION_KEY_VALUE_SEPARATORS.EQUAL_SEPARATOR]: equal,
  [CONDITION_KEY_VALUE_SEPARATORS.LOWER_THAN_SEPARATOR]: lowerThan,
  [CONDITION_KEY_VALUE_SEPARATORS.BIGGER_THAN_SEPARATOR]: biggerThan,
};

export const getOperator = (sign: CONDITION_KEY_VALUE_SEPARATORS) => {
  return COMPARE_OPERATIONS[sign] ?? equal;
};
