import { useState } from "react";
import { generateLabyrinth } from "./generator";
import "./App.css";
import type { Labyrinth } from "./generator-types";
import { calculateRoundedPath } from "./rounded-path";
import { getLabyrinthObj } from "./generator-helpers";

const strokeWidth = 12;

export default function Generator() {
  const [labyrinth, setLabyrinth] = useState<Labyrinth>();
  const [curvedPath, setCurvedPath] = useState<string>();

  const generate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurvedPath(undefined);
    setLabyrinth(generateLabyrinth());
  };

  const toggleRoundedCorners = () => {
    if (curvedPath || !labyrinth) {
      setCurvedPath(undefined);
    } else {
      setCurvedPath(
        calculateRoundedPath(labyrinth?.path, labyrinth.cellSize, 1),
      );
    }
  };

  const labyrinthObj = getLabyrinthObj(labyrinth, curvedPath);

  return (
    <>
      {labyrinth?.path && (
        <svg
          className="generated-svg"
          viewBox={`0 0 ${labyrinth.width} ${labyrinth.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g fill="none" fillRule="evenodd">
            <path
              d={curvedPath || labyrinth.path}
              stroke="black"
              strokeWidth={strokeWidth}
            />
          </g>
          {labyrinth.startCircle && (
            <circle
              r={strokeWidth / 2}
              cx={labyrinth.startCircle.cx}
              cy={labyrinth.startCircle.cy}
            />
          )}
          <circle
            r={strokeWidth / 2}
            cx={labyrinth.endCircle.cx}
            cy={labyrinth.endCircle.cy}
          />
        </svg>
      )}
      {labyrinth?.path && (
        <textarea
          cols={50}
          rows={6}
          value={JSON.stringify(labyrinthObj, null, 2)}
          readOnly
        />
      )}
      <button onClick={generate}>Generate labyrinth</button>
      {labyrinth?.roundedPath && (
        <button onClick={toggleRoundedCorners}>Toggle rounded corners</button>
      )}
    </>
  );
}
