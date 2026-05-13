import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import { getDatesInMonth, isFirstDayOfWeek } from "./helpers";
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

            return (
              <React.Fragment key={date.toDateString()}>
                {isFirst && <br />}
                {isFuture ? (
                  <span className="door">{formatDate(date, "d")}</span>
                ) : (
                  <span
                    className="door clickable"
                    onClick={() => setPuzzleDate(date)}
                  >
                    {formatDate(date, "d")}
                  </span>
                )}
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
