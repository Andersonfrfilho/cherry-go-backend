interface IDateProvider {
  checkAdulthood(date: Date): boolean;
  addDays(days: number): Date;
}

export { IDateProvider };
