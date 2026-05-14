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
} from "./labyrinths";

const locale = new Intl.Locale(navigator.language);
// 1 (monday) for en-GB, 7 (sunday) for en-US
const firstDayOfWeekForLocale =
  typeof Intl.Locale.prototype.getWeekInfo === "function"
    ? // @ts-ignore locale.getWeekInfo() not supported in Firefox
      locale.getWeekInfo().firstDay
    : 7;

const getIntersections = (path: string): Intersection[] => {
  paper.setup(document.createElement("canvas"));

  const paperPath = new paper.Path(path);

  const intersections: Intersection[] = [];
  paperPath.getIntersections(paperPath).forEach((loc) => {
    intersections.push({
      point: loc.point,
      angle1: loc.tangent.angle,
      angle2: loc.intersection.tangent.angle,
    });
  });

  paperPath.remove();

  return intersections;
};

const getDirection = (angle1: number, angle2: number) => {
  if (angle1 < 0) {
    return angle2 >= 90 || angle2 < -90 ? 1 : -1;
  } else {
    return angle2 >= 90 || angle2 < -90 ? -1 : 1;
  }
};

const getBridgePolygon = (
  intersectionData: Intersection,
  pathWidth: number,
) => {
  const WIDTH = pathWidth / 4;
  // push the far corners of the bridge sides out by this amount:
  const PARALLELOGRAM_PUSH = 1;
  const { point, angle1, angle2 } = intersectionData;

  // create a long rectangle to simulate each segment of the labyrinth path
  const rect1 = new paper.Path.Rectangle({
    center: point,
    size: new paper.Size(pathWidth * 5, pathWidth),
  });
  rect1.rotate(angle1);

  const rect2 = new paper.Path.Rectangle({
    center: point,
    size: new paper.Size(pathWidth * 5, pathWidth),
  });
  rect2.rotate(angle2);

  const intersection = rect1.intersect(rect2) as paper.Path;

  // get the corners as SVG polygon points
  const bridgePolygon = intersection.segments
    .map((seg) => `${seg.point.x} ${seg.point.y}`)
    .join(" ");

  // to calculate the side polygons, take two corners of the bridge and extend them out and to each side
  const { point: pointA } = intersection.segments[0];
  const { point: pointB } = intersection.segments[1];
  const { point: pointC } = intersection.segments[2];
  const { point: pointD } = intersection.segments[3];

  const sideADirection = getDirection(angle1, angle2);
  const sideBDirection = sideADirection * -1;

  const angle1Rad = angle1 * (Math.PI / 180);
  const angle2Rad = angle2 * (Math.PI / 180);

  const xAdjust = Math.cos(angle2Rad) * WIDTH;
  const yAdjust = Math.sin(angle2Rad) * WIDTH;
  const xPush = Math.cos(angle1Rad) * PARALLELOGRAM_PUSH;
  const yPush = Math.sin(angle1Rad) * PARALLELOGRAM_PUSH;
  const newPointA = new paper.Point(
    pointA.x + xAdjust * sideADirection - xPush,
    pointA.y + yAdjust * sideADirection - yPush,
  );
  const newPointB = new paper.Point(
    pointB.x + xAdjust * sideADirection + xPush,
    pointB.y + yAdjust * sideADirection + yPush,
  );

  const sideAPolygon = `${pointA.x} ${pointA.y} ${pointB.x} ${pointB.y} ${newPointB.x} ${newPointB.y} ${newPointA.x} ${newPointA.y}`;

  // same for sideBPolygon, with the other two points of the bridge
  const newPointC = new paper.Point(
    pointC.x + xAdjust * sideBDirection + xPush,
    pointC.y + yAdjust * sideBDirection + yPush,
  );
  const newPointD = new paper.Point(
    pointD.x + xAdjust * sideBDirection - xPush,
    pointD.y + yAdjust * sideBDirection - yPush,
  );
  const sideBPolygon = `${pointC.x} ${pointC.y} ${pointD.x} ${pointD.y} ${newPointD.x} ${newPointD.y} ${newPointC.x} ${newPointC.y}`;

  rect1.remove();
  rect2.remove();

  return { bridgePolygon, sideAPolygon, sideBPolygon };
};

const getBridges = (labyrinth: Labyrinth): Bridge[] => {
  const intersections = getIntersections(labyrinth.path);
  const bridges: Bridge[] = [];

  intersections.forEach((intersection) => {
    const { bridgePolygon, sideAPolygon, sideBPolygon } = getBridgePolygon(
      intersection,
      labyrinth.pathWidth,
    );
    bridges.push({
      bridgePolygon,
      sideAPolygon,
      sideBPolygon,
    });
  });

  return bridges;
};

const getLabyrinthFromIndex = (index: number): Labyrinth => {
  const labyrinth = {
    ...defaultLabyrinth,
    ...labyrinths[index],
  };

  labyrinth.bridges = getBridges(labyrinth);

  return labyrinth;
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
