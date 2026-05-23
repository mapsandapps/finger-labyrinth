import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import {
  getDatesInMonth,
  getLabyrinthForDate,
  getNumberOfDaysBeforeFirstDayOfMonth,
  isFirstDayOfWeek,
} from "./helpers";
import { formatDate, isAfter, isToday } from "date-fns";
import React, { useEffect, useState } from "react";
import Labyrinth from "./Labyrinth";
import Generator from "./Generator.tsx";
import { isDateInLocalStorage } from "./localstorage";

interface Style {
  transformOrigin: string;
}

function App() {
  const [puzzleDate, setPuzzleDate] = useState<Date | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const today = new Date();
  const datesInMonth = getDatesInMonth(today);
  const numberOfEmptyDays = getNumberOfDaysBeforeFirstDayOfMonth(today);
  const isInDevMode = import.meta.env.DEV;

  const onPopNavigation = () => {
    if (window.location.pathname === "/") {
      window.location.reload();
    }
  };
  window.addEventListener("popstate", onPopNavigation);

  useEffect(() => {
    return window.removeEventListener("popstate", onPopNavigation);
  }, []);

  const onClickDate = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
    date: Date,
  ) => {
    const { x, y } = e.currentTarget.getBoundingClientRect();
    setStyle({ ...{ transformOrigin: `${x}px ${y}px` } });
    setPuzzleDate(date);
    // since we're animating, we don't want to navigate within react, but we do want to push to the browser history
    if (window.location.pathname === "/") {
      window.history.pushState({}, "", "/labyrinth");
    }
  };

  return (
    <>
      <div className="home">
        <h1>Daily Labyrinth</h1>
        <div className="calendar">
          {[...Array(numberOfEmptyDays)].map((_, i) => (
            <div key={`empty-day-${i}`} className="door" />
          ))}
          {datesInMonth.map((date) => {
            const isFirst = isFirstDayOfWeek(date);
            const isPresent = isToday(date);
            const isFuture = isAfter(date, today);

            const {
              backgroundColor,
              path,
              pathColor,
              pathWidth,
              viewBoxWidth,
              viewBoxHeight,
            } = getLabyrinthForDate(date, false);

            const hasBeenCompleted = isDateInLocalStorage(date);

            return (
              <React.Fragment key={date.toDateString()}>
                {isFirst && <br />}
                {isFuture ? (
                  <div className="door">{formatDate(date, "d")}</div>
                ) : hasBeenCompleted ? (
                  <div
                    className={`door clickable ${isPresent && "today"}`}
                    style={{ backgroundColor, color: pathColor }}
                    onClick={(e) => onClickDate(e, date)}
                  >
                    <svg
                      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g fill="none" fillRule="evenodd">
                        <path
                          d={path}
                          stroke={pathColor}
                          strokeWidth={pathWidth}
                        />
                      </g>
                    </svg>
                  </div>
                ) : (
                  <div
                    className={`door clickable ${isPresent && "today"}`}
                    style={{ backgroundColor, color: pathColor }}
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
        <p>
          Using the mouse or touch, "walk" in and then back out of the
          labyrinth.
        </p>
      </div>
      {puzzleDate && style && (
        <div className="labyrinth-container" style={style}>
          <Labyrinth puzzleDate={puzzleDate} />
        </div>
      )}
      {isInDevMode && <Generator />}
      <Analytics />
    </>
  );
}

export default App;
