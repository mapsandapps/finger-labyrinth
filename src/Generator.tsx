import { useState } from "react";
import { generateLabyrinth } from "./generator";

export default function Generator() {
  const [path, setPath] = useState("");

  const generate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPath(generateLabyrinth());
  };

  return (
    <>
      {path && (
        <svg viewBox={`0 0 256 256`} preserveAspectRatio="xMidYMid meet">
          <g fill="none" fillRule="evenodd">
            <path d={path} />
          </g>
        </svg>
      )}
      <button onClick={generate}>Generate labyrinth</button>
    </>
  );
}
