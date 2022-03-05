import { format } from "date-fns";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./styles.css";

type PomodoroDayTypes = {
  date: string;
  countInMinutes: number;
};

type PomodoroDaysTypes = {
  pomodoroDays: Array<PomodoroDayTypes>;
};

export const CalendarHeatMap = ({ pomodoroDays }: PomodoroDaysTypes) => {
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
        startDate={new Date("2021-12-31")}
        endDate={new Date("2022-12-31")}
        titleForValue={(value) =>
          value?.countInMinutes &&
          `${format(new Date(value.date), "MMM dd, yyyy")} - ${
            value.countInMinutes
          } minute${value.countInMinutes > 1 && "s"} of study`
        }
        classForValue={(value) =>
          value
            ? `color-scale-${findValueCountRange(value.countInMinutes)}`
            : "color-empty"
        }
      />
    </div>
  );
};
