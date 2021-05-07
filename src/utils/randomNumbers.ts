interface IRandomParameters {
  min: number;
  max: number;
}
export default function randomNumbers({ min, max }: IRandomParameters) {
  return Math.floor(Math.random() * max) + min;
}
