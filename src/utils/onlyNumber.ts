export const CARACTER_PATTERN = /\D/g;

export function onlyNumber(value: string): string {
  return value && value.replace(CARACTER_PATTERN, "");
}
