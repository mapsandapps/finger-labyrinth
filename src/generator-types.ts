export type Direction = "up" | "left" | "down" | "right";

export type Polarity = "vertical" | "horizontal";

export type SvgCircleData = {
  cx: number;
  cy: number;
};

export type CellType =
  | "empty"
  | "horizontal"
  | "vertical"
  | "intersection"
  | "corner"
  | "center"
  | "end";

export interface Point {
  col: number;
  row: number;
}

export interface Cell {
  col: number;
  row: number;
  openUp?: boolean;
  openLeft?: boolean;
  openDown?: boolean;
  openRight?: boolean;
  type: CellType;
}

export type Grid = Cell[][];

export interface Labyrinth {
  grid: Grid;
  cols: number;
  rows: number;
  path: string;
  roundedPath: string;
  currentEnd: Cell;
  width: number;
  height: number;
  startCircle?: SvgCircleData;
  endCircle: SvgCircleData;
  cellSize: number;
}
