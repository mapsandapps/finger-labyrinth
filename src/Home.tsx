import { Link } from "react-router";
import "./App.css";
import {
  getDatesInMonth,
  getLabyrinthForDate,
  isFirstDayOfWeek,
} from "./helpers";
import { formatDate, isAfter, isBefore, isToday } from "date-fns";
import React from "react";

export default function Home() {
  const today = new Date();
  const datesInMonth = getDatesInMonth(today);

  return (
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
                formatDate(date, "d")
              ) : (
                <Link to="/labyrinth">{formatDate(date, "d")}</Link>
              )}
              <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
                <g fill="none" fillRule="evenodd">
                  <path d={path} stroke="black" strokeWidth={pathWidth / 4} />
                </g>
              </svg>
            </React.Fragment>
          );
        })}
        <button>Today</button>
      </div>
    </div>
  );
}
