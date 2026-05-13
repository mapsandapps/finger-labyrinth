import { type Touch } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  isSameDay,
} from "date-fns";
import { defaultLabyrinth, labyrinths } from "./labyrinths";

const getLabyrinthFromIndex = (index: number) => {
  return {
    ...defaultLabyrinth,
    ...labyrinths[index],
  };
};

const getCircleCenter = (el: SVGCircleElement) => {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    radius: rect.width / 2,
  };
};

export const isTouchOverCircle = (touch: Touch, el: SVGCircleElement) => {
  const { x, y, radius } = getCircleCenter(el);
  const dx = touch.clientX - x;
  const dy = touch.clientY - y;
  console.log({ x, y, dx, dy });
  return Math.sqrt(dx * dx + dy * dy) <= radius;
};

export const getDatesInMonth = (today: Date) => {
  const firstDay = startOfMonth(today);
  const lastDay = endOfMonth(today);

  return eachDayOfInterval({
    start: firstDay,
    end: lastDay,
  });
};

// used to rotate through all labyrinths
const getIntegerForDate = (date: Date) => {
  date.setHours(0, 0, 0, 0);

  const msInDay = 24 * 60 * 60 * 1000;
  return Math.floor(date.getTime() / msInDay);
};

export const getLabyrinthForDate = (date: Date) => {
  const numberOfLabyrinths = labyrinths.length;
  const intDate = getIntegerForDate(date);
  const labyrinthIndex = intDate % numberOfLabyrinths;
  return getLabyrinthFromIndex(labyrinthIndex);
};

export const isFirstDayOfWeek = (date: Date) => {
  const locale = new Intl.Locale(navigator.language);
  // @ts-ignore locale.getWeekInfo() not supported in Firefox
  // 1 (monday) for en-GB, 7 (sunday) for en-US
  const firstDayOfWeekForLocale = locale.getWeekInfo().firstDay || 7;
  const startOfWeekForDate = startOfWeek(date, {
    weekStartsOn: firstDayOfWeekForLocale,
  });
  return isSameDay(date, startOfWeekForDate);
};
