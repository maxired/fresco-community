export const eq = (a: string, b: string) => a === b;
export const neq = (a: number, b: number) => a != b;
export const be = (a: number, b: number) => a >= b;
export const le = (a: number, b: number) => a <= b;
export const bt = (a: number, b: number) => a > b;
export const lt = (a: number, b: number) => a < b;

export enum CONDITION_KEY_VALUE_SEPARATORS {
  EQ_SEPARATOR = "==",
  NEQ_SEPARATOR = "!=",
  BE_SEPARATOR = ">=",
  LE_SEPARATOR = "<=",
  BT_SEPARATOR = ">",
  LT_SEPARATOR = "<",
}

const COMPARE_OPERATIONS = {
  [CONDITION_KEY_VALUE_SEPARATORS.NEQ_SEPARATOR]: neq,
  [CONDITION_KEY_VALUE_SEPARATORS.BE_SEPARATOR]: be,
  [CONDITION_KEY_VALUE_SEPARATORS.LE_SEPARATOR]: le,
  [CONDITION_KEY_VALUE_SEPARATORS.EQ_SEPARATOR]: eq,
  [CONDITION_KEY_VALUE_SEPARATORS.LT_SEPARATOR]: lt,
  [CONDITION_KEY_VALUE_SEPARATORS.BT_SEPARATOR]: bt,
};

export const getOperator = (sign: CONDITION_KEY_VALUE_SEPARATORS) => {
  return COMPARE_OPERATIONS[sign] ?? eq;
};
