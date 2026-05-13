import { Link } from "react-router";
import "./App.css";
import { getDatesInMonth, isFirstDayOfWeek } from "./helpers";
import { formatDate } from "date-fns";
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
          return (
            <React.Fragment key={date.toDateString()}>
              {isFirst && <br />}
              <Link to="/labyrinth">{formatDate(date, "d")}</Link>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
