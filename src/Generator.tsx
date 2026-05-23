import { useState } from "react";
import { generateLabyrinth } from "./generator";
import "./App.css";
import type { Labyrinth } from "./generator-types";
import { getLabyrinthObj } from "./generator-helpers";
import type { LabyrinthData } from "./labyrinths";

const strokeWidth = 12;

export default function Generator() {
  const [labyrinth, setLabyrinth] = useState<Labyrinth>();
  const [shouldUseRoundedPath, setShouldUseRoundedPath] = useState(false);

  const generate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const labyrinth = generateLabyrinth();
    setLabyrinth(labyrinth);
  };

  const labyrinthObj = getLabyrinthObj(labyrinth, shouldUseRoundedPath);

  const toggleRoundedCorners = () => {
    setShouldUseRoundedPath(!shouldUseRoundedPath);
  };

  return (
    <>
      {labyrinth && labyrinthObj && (
        <svg
          className="generated-svg"
          viewBox={`0 0 ${labyrinth.width} ${labyrinth.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g fill="none" fillRule="evenodd">
            <path
              d={labyrinthObj.path}
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
      <button onClick={toggleRoundedCorners}>Toggle rounded corners</button>
    </>
  );
}
