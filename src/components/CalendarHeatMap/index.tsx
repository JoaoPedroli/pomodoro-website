import { useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import "./styles.css";

export const CalendarHeatMap = ({ pomodoroDays }) => {
  const findValueCountRange = (countInMinutes: number) => {
    if (countInMinutes <= 25) {
      return 25;
    }
    if (countInMinutes <= 50) {
      return 50;
    }
    if (countInMinutes <= 100) {
      return 100;
    }
    return 200;
  };

  return (
    <div className="calendar-heatmap">
      <CalendarHeatmap
        values={pomodoroDays ?? []}
        showWeekdayLabels
        startDate={new Date("2020-12-31")}
        endDate={new Date("2021-12-31")}
        titleForValue={(value) =>
          `${value?.countInMinutes ?? 0} minuto(s) de estudo`}
        classForValue={(value) =>
          value
            ? `color-scale-${findValueCountRange(value.countInMinutes)}`
            : "color-empty"}
      />
    </div>
  );
};
