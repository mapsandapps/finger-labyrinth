import { type Touch } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  isSameDay,
  getDay,
} from "date-fns";
import paper from "paper";
import {
  defaultLabyrinth,
  labyrinths,
  type Bridge,
  type Intersection,
  type Labyrinth,
  type LabyrinthData,
} from "./labyrinths";

const locale = new Intl.Locale(navigator.language);
// 1 (monday) for en-GB, 7 (sunday) for en-US
const firstDayOfWeekForLocale =
  typeof Intl.Locale.prototype.getWeekInfo === "function"
    ? // @ts-ignore locale.getWeekInfo() not supported in Firefox
      locale.getWeekInfo().firstDay
    : 7;

// Extract a sub-path between two offsets using Paper.js curve splitting
const extractSubPath = (
  source: paper.Path,
  startOffset: number,
  endOffset: number,
): paper.Path => {
  // Clone the path so we can split it non-destructively
  const clone = source.clone({ insert: false }) as paper.Path;

  // Get locations at our two cut points
  const startLoc = clone.getLocationAt(startOffset);
  const endLoc = clone.getLocationAt(endOffset);

  if (!startLoc || !endLoc) {
    clone.remove();
    return new paper.Path();
  }

  // Split at end first (splitting changes offsets, so end before start)
  const afterEnd = clone.splitAt(endLoc) as paper.Path | null;
  const segment = clone.splitAt(startLoc) as paper.Path | null;

  // After two splits: clone = [0→start], segment = [start→end], afterEnd = [end→∞]
  clone.remove();
  afterEnd?.remove();

  return segment ?? new paper.Path();
};

const getIntersections = (path: string): Intersection[] => {
  paper.setup(document.createElement("canvas"));

  const paperPath = new paper.Path(path);
  const EXTENSION_PX = 20;

  const intersections: Intersection[] = [];
  paperPath.getIntersections(paperPath).forEach((intersection) => {
    const offset = intersection.offset;
    const totalLength = paperPath.length;

    const startOffset = offset - EXTENSION_PX;
    const endOffset = offset + EXTENSION_PX;

    const segmentPath = extractSubPath(
      paperPath,
      Math.max(0, startOffset),
      Math.min(totalLength, endOffset),
    );
    intersections.push({
      point: intersection.point,
      angle1: intersection.tangent.angle,
      angle2: intersection.intersection.tangent.angle,
      path: segmentPath.pathData,
      offsetOver: intersection.offset,
      offsetUnder: intersection.intersection.offset,
    });
  });

  paperPath.remove();

  return intersections;
};

const getBridges = (labyrinth: Labyrinth): Bridge[] => {
  const intersections = getIntersections(labyrinth.path);
  const bridges: Bridge[] = [];

  intersections.forEach((intersection) => {
    bridges.push({
      path: intersection.path,
      offsetOver: intersection.offsetOver,
      offsetUnder: intersection.offsetUnder,
    });
  });

  return bridges;
};

// NOTE: not the same as getCircleCenter
const getCenterCircle = (labyrinth: LabyrinthData) => {
  paper.setup(new paper.Size(500, 500));

  const path = new paper.Path(labyrinth.path);
  const endPoint = path.lastSegment.point;
  return {
    cx: labyrinth.centerCircle?.cx || endPoint.x,
    cy: labyrinth.centerCircle?.cy || endPoint.y,
    r: labyrinth.centerCircle?.r || labyrinth.pathWidth! / 2,
  };
};

const getStartCircle = (labyrinth: LabyrinthData) => {
  paper.setup(new paper.Size(500, 500));

  const path = new paper.Path(labyrinth.path);
  const startPoint = path.firstSegment.point;
  return {
    cx: startPoint.x,
    cy: startPoint.y,
    r: labyrinth.pathWidth! / 2,
  };
};

const getLabyrinthFromIndex = (
  index: number,
  isPlayable: boolean,
): Labyrinth => {
  const labyrinth: any = {
    ...defaultLabyrinth,
    ...labyrinths[index],
  };

  if (isPlayable) labyrinth.bridges = getBridges(labyrinth);
  labyrinth.centerCircle = getCenterCircle(labyrinth);
  labyrinth.startCircle = getStartCircle(labyrinth);

  return labyrinth;
};

// NOTE: not the same as getCenterCircle
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

export const getLabyrinthForDate = (date: Date, isPlayable: boolean) => {
  const numberOfLabyrinths = labyrinths.length;
  const intDate = getIntegerForDate(date);
  const labyrinthIndex = intDate % numberOfLabyrinths;
  return getLabyrinthFromIndex(labyrinthIndex, isPlayable);
};

export const getNumberOfDaysBeforeFirstDayOfMonth = (date: Date) => {
  const firstOfMonth = startOfMonth(date);
  const firstDay = getDay(firstOfMonth);

  if (firstDayOfWeekForLocale >= firstDay) {
    return 7 + firstDay - firstDayOfWeekForLocale;
  }
  return firstDay - firstDayOfWeekForLocale;
};

export const isFirstDayOfWeek = (date: Date) => {
  const startOfWeekForDate = startOfWeek(date, {
    weekStartsOn: firstDayOfWeekForLocale,
  });
  return isSameDay(date, startOfWeekForDate);
};
