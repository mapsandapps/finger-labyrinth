import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import {
  getDatesInMonth,
  getLabyrinthForDate,
  isFirstDayOfWeek,
} from "./helpers";
import { formatDate, isAfter, isToday } from "date-fns";
import React, { useState } from "react";
import Labyrinth from "./Labyrinth";

interface Style {
  transformOrigin: string;
}

function App() {
  const [puzzleDate, setPuzzleDate] = useState<Date | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const today = new Date();
  const datesInMonth = getDatesInMonth(today);

  const onClickDate = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
    date: Date,
  ) => {
    const { x, y } = e.currentTarget.getBoundingClientRect();
    setStyle({ ...{ transformOrigin: `${x}px ${y}px` } });
    setPuzzleDate(date);
  };

  return (
    <>
      <div className="home">
        <h1>Daily Labyrinth</h1>
        <div className="calendar">
          {datesInMonth.map((date) => {
            const isFirst = isFirstDayOfWeek(date);
            const isPresent = isToday(date);
            const isFuture = isAfter(date, today);

            const { backgroundColor } = getLabyrinthForDate(date);

            return (
              <React.Fragment key={date.toDateString()}>
                {isFirst && <br />}
                {isFuture ? (
                  <div className="door">{formatDate(date, "d")}</div>
                ) : (
                  <div
                    className={`door clickable ${isPresent && "today"}`}
                    style={{ backgroundColor }}
                    onClick={(e) => onClickDate(e, date)}
                  >
                    {formatDate(date, "d")}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <button onClick={(e) => onClickDate(e, today)}>Today</button>
      </div>
      {puzzleDate && style && (
        <div className="labyrinth-container" style={style}>
          <Labyrinth puzzleDate={puzzleDate} />
        </div>
      )}
      <Analytics />
    </>
  );
}

export default App;
