import type { Cell, CellType, Grid, Polarity } from "./generator-types";

export const getCellType = (cell: Cell, endCell: Cell): CellType => {
  const numberOfOpenings =
    (cell.openUp ? 1 : 0) +
    (cell.openRight ? 1 : 0) +
    (cell.openLeft ? 1 : 0) +
    (cell.openDown ? 1 : 0);
  if (numberOfOpenings === 4) return "intersection";
  if (cell.openUp && cell.openDown) return "vertical";
  if (cell.openRight && cell.openLeft) return "horizontal";
  if (numberOfOpenings === 2) return "corner";
  if (numberOfOpenings === 0) return "empty";
  if (cell.col === endCell.col && cell.row === endCell.row) return "end";
  return "center";
};

export const getIsCellPassable = (polarity: Polarity, type: CellType) => {
  if (type === "intersection" || type === "center" || type === "corner")
    return false;
  if (type === polarity) return false;

  return true;
};

export const prettyPrintGrid = (grid: Grid) => {
  let printable = "";
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.type === "empty") printable += " ";
      if (cell.type === "horizontal") printable += "─";
      if (cell.type === "vertical") printable += "│";
      if (cell.type === "intersection") printable += "┼";
      if (cell.type === "center") printable += "╵";
      if (cell.type === "corner") {
        if (cell.openUp && cell.openLeft) printable += "┘";
        if (cell.openLeft && cell.openDown) printable += "┐";
        if (cell.openDown && cell.openRight) printable += "┌";
        if (cell.openRight && cell.openUp) printable += "└";
      }
      if (cell.type === "end") {
        if (cell.openUp) printable += "╵";
        if (cell.openLeft) printable += "╴";
        if (cell.openDown) printable += "╷";
        if (cell.openRight) printable += "╶";
      }
    });
    printable += "\n";
  });

  console.log(printable);
};

export const initializeGrid = (cols: number, rows: number): Grid => {
  return Array.from({ length: rows }, (_r, j) =>
    Array.from({ length: cols }, (_c, i) => ({
      col: i,
      row: j,
      type: "empty",
      openUp: false,
      openLeft: false,
      openDown: false,
      openRight: false,
    })),
  );
};
