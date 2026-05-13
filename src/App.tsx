import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import {
  getDatesInMonth,
  getLabyrinthForDate,
  isFirstDayOfWeek,
} from "./helpers";
import { formatDate, isAfter, isBefore, isToday } from "date-fns";
import React, { useState } from "react";
import Labyrinth from "./Labyrinth";

function App() {
  const [puzzleDate, setPuzzleDate] = useState<Date | null>(null);
  const today = new Date();
  const datesInMonth = getDatesInMonth(today);
  return (
    <>
      <div className="home">
        <h1>Daily Labyrinth</h1>
        <div className="calendar">
          {datesInMonth.map((date) => {
            const isFirst = isFirstDayOfWeek(date);
            const isPresent = isToday(date);
            const isPast = isBefore(date, today);
            const isFuture = isAfter(date, today);

            const { path, pathWidth, viewBoxWidth, viewBoxHeight } =
              getLabyrinthForDate(date);
            return (
              <React.Fragment key={date.toDateString()}>
                {isFirst && <br />}
                {isFuture ? (
                  <span>{formatDate(date, "d")}</span>
                ) : (
                  <span onClick={() => setPuzzleDate(date)}>
                    {formatDate(date, "d")}
                  </span>
                )}
                <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
                  <g fill="none" fillRule="evenodd">
                    <path d={path} stroke="black" strokeWidth={pathWidth / 4} />
                  </g>
                </svg>
              </React.Fragment>
            );
          })}
        </div>
        <button onClick={() => setPuzzleDate(today)}>Today</button>
      </div>
      {puzzleDate && (
        <div className="labyrinth-container">
          <Labyrinth puzzleDate={puzzleDate} />
        </div>
      )}
      <Analytics />
    </>
  );
}

export default App;
