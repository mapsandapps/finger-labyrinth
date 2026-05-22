import { random } from "lodash";
import type { Labyrinth, Point } from "./generator-types";
import {
  getIsCellPassable,
  initializeGrid,
  prettyPrintGrid,
} from "./generator-helpers";

let labyrinth: Labyrinth;

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

  // carve path
  if (direction === "up") {
    for (let r = start.row; r >= end.row; r--) {
      const cell = labyrinth.grid[r][start.col];
      if (r === end.row) {
        cell.type = "end";
        cell.openDown = true;
      } else if (r === start.row) {
        // this was the previous end; convert it to a corner (unless it was the middle of the labyrinth)
        if (cell.type !== "center") {
          cell.type = "corner";
        }
        cell.openUp = true;
      } else {
        if (cell.type === "horizontal") {
          cell.type = "intersection";
        } else {
          cell.type = "vertical";
        }
        cell.openDown = true;
        cell.openUp = true;
      }
    }
  } else if (direction === "left") {
    for (let c = start.col; c >= end.col; c--) {
      const cell = labyrinth.grid[start.row][c];
      if (c === end.col) {
        cell.type = "end";
        cell.openRight = true;
      } else if (c === start.col) {
        // this was the previous end; convert it to a corner (unless it was the middle of the labyrinth)
        // (so far, the middle can only have a direction of up, but we'll account for it anyway)
        if (cell.type !== "center") {
          cell.type = "corner";
        }
        cell.openLeft = true;
      } else {
        if (cell.type === "vertical") {
          cell.type = "intersection";
        } else {
          cell.type = "horizontal";
        }
        cell.openLeft = true;
        cell.openRight = true;
      }
    }
  } else if (direction === "down") {
    for (let r = start.row; r <= end.row; r++) {
      const cell = labyrinth.grid[r][start.col];
      if (r === end.row) {
        cell.type = "end";
        cell.openUp = true;
      } else if (r === start.row) {
        // this was the previous end; convert it to a corner (unless it was the middle of the labyrinth)
        // (so far, the middle can only have a direction of up, but we'll account for it anyway)
        if (cell.type !== "center") {
          cell.type = "corner";
        }
        cell.openDown = true;
      } else {
        if (cell.type === "horizontal") {
          cell.type = "intersection";
        } else {
          cell.type = "vertical";
        }
        cell.openUp = true;
        cell.openDown = true;
      }
    }
  } else if (direction === "right") {
    for (let c = start.col; c <= end.col; c++) {
      const cell = labyrinth.grid[start.row][c];
      if (c === end.col) {
        cell.type = "end";
        cell.openLeft = true;
      } else if (c === start.col) {
        // this was the previous end; convert it to a corner (unless it was the middle of the labyrinth)
        // (so far, the middle can only have a direction of up, but we'll account for it anyway)
        if (cell.type !== "center") {
          cell.type = "corner";
        }
        cell.openRight = true;
      } else {
        if (cell.type === "vertical") {
          cell.type = "intersection";
        } else {
          cell.type = "horizontal";
        }
        cell.openRight = true;
        cell.openLeft = true;
      }
    }
  }

  // set end
  labyrinth.currentEnd = labyrinth.grid[end.row][end.col];
};

const findLeftOptions = () => {
  const options = [];
  // if (labyrinth.currentEnd.col <= 0) return [];

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
  // if (labyrinth.currentEnd.col >= labyrinth.cols - 1) return [];

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
    labyrinth.currentEnd?.openDown || labyrinth.currentEnd?.openUp;

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

const findAndCarveNextPath = () => {
  const turnOptions = findTurnOptions();

  const nextEnd = turnOptions[random(turnOptions.length - 1)];

  carvePath(labyrinth.currentEnd, nextEnd);
};

// TODO: refactor to not need this (probably)
const makeFirstMove = () => {
  const { col, row: startRow } = labyrinth.currentEnd;
  labyrinth.currentEnd.type = "center";
  labyrinth.currentEnd.openUp = true;

  const maxPathLength = labyrinth.rows - startRow - 1;
  const pathLength = random(1, maxPathLength);
  carvePath(
    { col: col, row: startRow },
    {
      col: col,
      row: startRow - pathLength,
    },
  );
};

export const generateLabyrinth = (): string => {
  const cols = 11;
  const rows = 11;
  const centerCol = Math.floor(cols / 2);
  const centerRow = Math.floor(rows / 2);
  const grid = initializeGrid(cols, rows);

  labyrinth = {
    grid,
    cols,
    rows,
    backwardsPath: "",
    currentEnd: grid[centerRow][centerCol],
  };

  makeFirstMove();

  // TODO: recurse
  findAndCarveNextPath();
  findAndCarveNextPath();
  findAndCarveNextPath();
  findAndCarveNextPath();
  findAndCarveNextPath();
  findAndCarveNextPath();

  console.log(labyrinth);
  prettyPrintGrid(labyrinth.grid);

  return "";
};
