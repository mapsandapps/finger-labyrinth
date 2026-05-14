import { format } from "date-fns";

const getDateString = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const isDateInLocalStorage = (date: Date): boolean => {
  const dateString = getDateString(date);
  const key = "completed";
  const data = localStorage.getItem(key);

  if (!data || !dateString) return false;
  const parsed: string[] = JSON.parse(data);

  var foundIndex = parsed!.findIndex((d) => {
    return d === dateString;
  });

  return foundIndex > -1;
};

export const addDateToLocalStorage = (date: Date) => {
  const dateString = getDateString(date);
  const key = "completed";
  const existingData = localStorage.getItem(key);

  if (!existingData) {
    localStorage.setItem(key, JSON.stringify([dateString]));
    return;
  }

  const parsed: string[] = JSON.parse(existingData);

  var foundIndex = parsed!.findIndex((d) => {
    return d === dateString;
  });

  if (foundIndex < 0) {
    parsed.push(dateString);
    localStorage.setItem(key, JSON.stringify(parsed));
  } else {
    console.warn("date already in array");
  }
};
