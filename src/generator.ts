import { random } from "lodash";
import type { Labyrinth, Point } from "./generator-types";
import {
  getCellType,
  getIsCellPassable,
  initializeGrid,
  prependToPath,
  prettyPrintGrid,
  removeLastLine,
} from "./generator-helpers";
import { calculateRoundedPath } from "./rounded-path";

let labyrinth: Labyrinth;
const AVAILABLE_COLS = 9;
const AVAILABLE_ROWS = 9;
export const BORDER = 16; // space around outside of labyrinth
export const CELL_SIZE = 16; // width & height of each cell
export const HALF_CELL_SIZE = CELL_SIZE / 2;

const carvePath = (start: Point, end: Point) => {
  const direction =
    start.col === end.col && start.row > end.row
      ? "up"
      : start.col === end.col && start.row < end.row
        ? "down"
        : start.row === end.row && start.col < end.col
          ? "right"
          : start.row === end.row && start.col > end.col
            ? "left"
            : "ERROR";

  if (direction === "ERROR") {
    console.error("broken");
    return;
  }

  // set end
  labyrinth.currentEnd = labyrinth.grid[end.row][end.col];

  // carve path
  if (direction === "up") {
    for (let r = start.row; r >= end.row; r--) {
      const cell = labyrinth.grid[r][start.col];
      if (r === end.row) {
        cell.openDown = true;
      } else if (r === start.row) {
        cell.openUp = true;
      } else {
        cell.openDown = true;
        cell.openUp = true;
      }

      cell.type = getCellType(cell, labyrinth.currentEnd);
    }
  } else if (direction === "left") {
    for (let c = start.col; c >= end.col; c--) {
      const cell = labyrinth.grid[start.row][c];
      if (c === end.col) {
        cell.openRight = true;
      } else if (c === start.col) {
        cell.openLeft = true;
      } else {
        cell.openLeft = true;
        cell.openRight = true;
      }

      cell.type = getCellType(cell, labyrinth.currentEnd);
    }
  } else if (direction === "down") {
    for (let r = start.row; r <= end.row; r++) {
      const cell = labyrinth.grid[r][start.col];
      if (r === end.row) {
        cell.openUp = true;
      } else if (r === start.row) {
        cell.openDown = true;
      } else {
        cell.openUp = true;
        cell.openDown = true;
      }

      cell.type = getCellType(cell, labyrinth.currentEnd);
    }
  } else if (direction === "right") {
    for (let c = start.col; c <= end.col; c++) {
      const cell = labyrinth.grid[start.row][c];
      if (c === end.col) {
        cell.openLeft = true;
      } else if (c === start.col) {
        cell.openRight = true;
      } else {
        cell.openRight = true;
        cell.openLeft = true;
      }

      cell.type = getCellType(cell, labyrinth.currentEnd);
    }
  }
  labyrinth.path = prependToPath(labyrinth.path, start.col, start.row);
};

const findLeftOptions = () => {
  const options = [];

  for (let c = labyrinth.currentEnd.col - 1; c >= 0; c--) {
    const cell = labyrinth.grid[labyrinth.currentEnd.row][c];

    if (!getIsCellPassable("horizontal", cell.type)) {
      // can't move left past this point; break out of for loop
      return options;
    } else if (cell.type === "empty") {
      options.push(cell);
    }
  }

  return options;
};

const findRightOptions = () => {
  const options = [];

  for (let c = labyrinth.currentEnd.col + 1; c <= labyrinth.cols - 1; c++) {
    const cell = labyrinth.grid[labyrinth.currentEnd.row][c];

    if (!getIsCellPassable("horizontal", cell.type)) {
      // can't move right past this point; break out of for loop
      return options;
    } else if (cell.type === "empty") {
      options.push(cell);
    }
  }

  return options;
};

const findUpOptions = () => {
  const options = [];

  for (let r = labyrinth.currentEnd.row - 1; r >= 0; r--) {
    const cell = labyrinth.grid[r][labyrinth.currentEnd.col];

    if (!getIsCellPassable("vertical", cell.type)) {
      // can't move left past this point; break out of for loop
      return options;
    } else if (cell.type === "empty") {
      options.push(cell);
    }
  }

  return options;
};

const findDownOptions = () => {
  const options = [];

  for (let r = labyrinth.currentEnd.row + 1; r <= labyrinth.rows - 1; r++) {
    const cell = labyrinth.grid[r][labyrinth.currentEnd.col];

    if (!getIsCellPassable("vertical", cell.type)) {
      // can't move right past this point; break out of for loop
      return options;
    } else if (cell.type === "empty") {
      options.push(cell);
    }
  }

  return options;
};

// if the path is going up or down, look left and right to see where we could move to next
// if it's going left or right, look up and down
const findTurnOptions = () => {
  const isLookingHorizontally =
    labyrinth.currentEnd.openDown || labyrinth.currentEnd.openUp;

  if (isLookingHorizontally) {
    // left & right need to be split because we need to "walk" left and "walk" right, since there are certain cells that will be impassable, and we don't want to move to points beyond those ("beyond" relative to the last ending point)
    const leftOptions = findLeftOptions();
    const rightOptions = findRightOptions();
    const turnOptions = [...leftOptions, ...rightOptions];
    return turnOptions;
  } else {
    // up & down need to be split because we need to "walk" up and "walk" down, since there are certain cells that will be impassable, and we don't want to move to points beyond those ("beyond" relative to the last ending point)
    const upOptions = findUpOptions();
    const downOptions = findDownOptions();
    const turnOptions = [...upOptions, ...downOptions];
    return turnOptions;
  }
};

const findAheadOptions = () => {
  if (labyrinth.currentEnd.openUp) {
    return findDownOptions();
  } else if (labyrinth.currentEnd.openRight) {
    return findLeftOptions();
  } else if (labyrinth.currentEnd.openDown) {
    return findUpOptions();
  }
  return findRightOptions();
};

// recursive
const findAndCarveNextPath = () => {
  const turnOptions = findTurnOptions();

  // if there are no turns that can be made, try to keep moving ahead
  if (turnOptions.length < 1) {
    const aheadOptions = findAheadOptions();

    // if there are no options to continue straight, stop recursing & exit
    if (aheadOptions.length < 1) return;

    const nextEnd = aheadOptions[random(aheadOptions.length - 1)];
    // remove last line segment from path; it will be replaced with the longer one
    labyrinth.path = removeLastLine(labyrinth.path);
    carvePath(labyrinth.currentEnd, nextEnd);
  } else {
    const nextEnd = turnOptions[random(turnOptions.length - 1)];
    carvePath(labyrinth.currentEnd, nextEnd);
  }

  findAndCarveNextPath();
};

const makeFirstMove = () => {
  const { col, row: startRow } = labyrinth.currentEnd;

  const maxPathLength = labyrinth.rows - startRow - 1;
  const pathLength = random(1, maxPathLength);
  carvePath(labyrinth.currentEnd, {
    col: col,
    row: startRow - pathLength,
  });
};

export const generateLabyrinth = (): Labyrinth => {
  const cols = AVAILABLE_COLS;
  const rows = AVAILABLE_ROWS;
  const centerCol = Math.floor(cols / 2);
  const centerRow = Math.floor(rows / 2);
  const grid = initializeGrid(cols, rows);

  labyrinth = {
    grid,
    cols,
    rows,
    path: "",
    currentEnd: grid[centerRow][centerCol],
    // NOTE: size is not changed if some rows/cols are not used
    width: BORDER * 2 + AVAILABLE_COLS * CELL_SIZE,
    height: BORDER * 2 + AVAILABLE_ROWS * CELL_SIZE,
    endCircle: {
      cx: BORDER + centerCol * CELL_SIZE + HALF_CELL_SIZE,
      cy: BORDER + centerRow * CELL_SIZE + HALF_CELL_SIZE,
    },
    cellSize: CELL_SIZE,
  };
  labyrinth.currentEnd.type = "center";
  labyrinth.currentEnd.openUp = true;

  makeFirstMove();
  findAndCarveNextPath(); // recursive

  console.log(labyrinth);
  prettyPrintGrid(labyrinth.grid);

  // prepend the start point to the path
  const labyrinthStartX =
    BORDER + labyrinth.currentEnd.col * CELL_SIZE + HALF_CELL_SIZE;
  const labyrinthStartY =
    BORDER + labyrinth.currentEnd.row * CELL_SIZE + HALF_CELL_SIZE;
  labyrinth.path = `M ${labyrinthStartX} ${labyrinthStartY} ` + labyrinth.path;
  labyrinth.startCircle = {
    cx: labyrinthStartX,
    cy: labyrinthStartY,
  };
  labyrinth.roundedPath = calculateRoundedPath(labyrinth.path, CELL_SIZE, 1);
  return labyrinth;
};

// TODO: round path
