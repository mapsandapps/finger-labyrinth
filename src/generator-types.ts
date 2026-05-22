export type Direction = "up" | "left" | "down" | "right";

export type Polarity = "vertical" | "horizontal";

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
  backwardsPath: string;
  currentEnd: Cell;
}
