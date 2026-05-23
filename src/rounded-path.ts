import {
  parseSVG,
  makeAbsolute,
  // type Command,
  type CommandMadeAbsolute,
} from "svg-path-parser";

interface CommandPlus {
  code: string;
  x: number;
  x0: number;
  y: number;
  y0: number;
  isVertical: boolean;
  isHorizontal: boolean;
  verticalOrHorizontalDistance: number;
}

const serialize = (commands: any[]) =>
  commands
    .map((command) => {
      const {
        code,
        x,
        y,
        x1,
        y1,
        x2,
        y2,
        rx,
        ry,
        xAxisRotation,
        largeArc,
        sweep,
      } = command;
      switch (code) {
        case "M":
          return `M ${x} ${y}`;
        case "L":
          return `L ${x} ${y}`;
        case "H":
          return `H ${x}`;
        case "V":
          return `V ${y}`;
        case "C":
          return `C ${x1} ${y1} ${x2} ${y2} ${x} ${y}`;
        case "Q":
          return `Q ${x1} ${y1} ${x} ${y}`;
        case "Z":
          return `Z`;
        case "A":
          return `A ${rx} ${ry} ${xAxisRotation} ${largeArc ? 1 : 0} ${sweep ? 1 : 0} ${x} ${y}`;
        case "S":
          return `S ${x2} ${y2} ${x} ${y}`;
        case "T":
          return `T ${x} ${y}`;
      }
    })
    .join(" ");

const getIsVertical = (command: CommandMadeAbsolute) => {
  return command.x === command.x0 && command.y !== command.y0;
};

const getIsHorizontal = (command: CommandMadeAbsolute) => {
  return command.y === command.y0 && command.x !== command.x0;
};

const getArePerpendicular = (
  command: CommandPlus,
  nextCommand: CommandPlus,
) => {
  if (command.isHorizontal && nextCommand.isHorizontal) return false;
  if (command.isVertical && nextCommand.isVertical) return false;
  return true;
};

const getDistance = (
  command: CommandMadeAbsolute,
  isVertical: boolean,
  isHorizontal: boolean,
) => {
  if (isVertical) return command.y - command.y0;
  if (isHorizontal) return command.x - command.x0;
  return 0;
};

const getMoreInfoForCommands = (
  absolutePath: CommandMadeAbsolute[],
): CommandPlus[] => {
  const commands: CommandPlus[] = [];

  absolutePath.forEach((command, i) => {
    const isVertical = getIsVertical(command);
    const isHorizontal = getIsHorizontal(command);
    // console.log(command);
    // if (i === absolutePath.length) return;
    commands.push({
      code: command.code,
      x: command.x,
      x0: command.x0,
      y: command.y,
      y0: command.y0,
      isVertical,
      isHorizontal,
      verticalOrHorizontalDistance: getDistance(
        command,
        isVertical,
        isHorizontal,
      ),
    });
  });

  return commands;
};

export const calculateRoundedPath = (
  path: string,
  cellSize: number,
): string => {
  const halfCellSize = cellSize / 2;
  const absolutePath: CommandMadeAbsolute[] = parseSVG(
    path,
  ) as CommandMadeAbsolute[];
  makeAbsolute(absolutePath); // mutates in place
  const commands = getMoreInfoForCommands(absolutePath);
  const curvedCommands: any[] = [];
  // i think...
  // if this move and the next are perpendicular, round the last cellSize of this and the first cellSize of that
  // if needed, add & modify moves
  commands.forEach((command, i) => {
    if (command.code === "M") {
      curvedCommands.push(command);
    } else if (i < commands.length - 1) {
      const nextCommand = commands[i + 1];
      const arePerpendicular = getArePerpendicular(command, nextCommand);
      if (
        arePerpendicular &&
        Math.abs(command.verticalOrHorizontalDistance) >= halfCellSize
      ) {
        const direction = command.verticalOrHorizontalDistance > 0 ? 1 : -1;
        const nextDirection =
          nextCommand.verticalOrHorizontalDistance > 0 ? 1 : -1;
        // push segment of command
        const x = command.isHorizontal
          ? command.x - halfCellSize * direction
          : command.x;
        const y = command.isVertical
          ? command.y - halfCellSize * direction
          : command.y;
        curvedCommands.push({
          code: command.code,
          x,
          y,
        });
        // push arc
        const newX = command.isHorizontal
          ? x + halfCellSize * direction
          : x + halfCellSize * nextDirection;
        const newY = command.isVertical
          ? y + halfCellSize * direction
          : y + halfCellSize * nextDirection;

        const sameSign =
          command.verticalOrHorizontalDistance > 0 ===
          nextCommand.verticalOrHorizontalDistance > 0;
        const sweepFlag = command.isHorizontal ? sameSign : !sameSign;

        curvedCommands.push({
          code: "A",
          x0: x,
          y0: y,
          rx: halfCellSize,
          ry: halfCellSize,
          xAxisRotation: 0,
          largeArc: false,
          sweep: sweepFlag,
          x: newX,
          y: newY,
        });

        // // TODO: remove
        // curvedCommands.push({
        //   code: "M",
        //   x: newX,
        //   y: newY,
        // });
      } else {
        curvedCommands.push(command);
      }
    }
  });
  console.log(commands);
  console.log(curvedCommands);

  return serialize(curvedCommands);
};
