export function isLaterHHMM(time1: string, time2: string) {
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);

  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;

  return totalMinutes1 > totalMinutes2;
}

export function objectIsEmpty(obj: object) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

export function toRussianDateShort(date: string) {
  return new Date(date).toLocaleDateString();
}

export function dateStringToIsoString(date: string){
  return new Date(date).toISOString();
}

export function getMonthStartEnd(year: number, month: number) {
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

  const formatDate = (date: Date) => date.toISOString().split('.')[0] + 'Z';

  const timeMin = formatDate(start);
  const timeMax = formatDate(end);

  return {timeMin, timeMax};
}