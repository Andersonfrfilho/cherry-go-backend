interface ParamsDTO<T> {
  array: T[];
  property: string;
}
export function sortArrayObjects<T>({ array, property }: ParamsDTO<T>): T[] {
  return array.sort((element_ant, element_pos) =>
    element_ant[property] > element_pos[property]
      ? 1
      : element_pos[property] > element_ant[property]
      ? -1
      : 0
  );
}
