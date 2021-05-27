interface IDateProvider {
  checkAdulthood(date: Date): boolean;
  addDays(days: number): Date;
  compareIfBefore(start_date: Date, end_date: Date): boolean;
  addMinutes(minutes: number): Date;
  dateNow(): Date;
}

export { IDateProvider };
