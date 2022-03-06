import { format } from "date-fns";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styles from "./styles.module.scss";

type PomodoroDayProps = {
  date?: string;
  countInMinutes?: number;
};

type PomodoroDaysProps = {
  pomodoroDays: Array<PomodoroDayProps>;
};

export const CalendarHeatMap = ({ pomodoroDays }: PomodoroDaysProps) => {
  const currentDay = new Date();

  const formatDate = (date: Date): string => format(date, "yyyy-MM-dd");

  const getTomorrowsDate = (): Date => {
    const tomorrowsDate = new Date();
    tomorrowsDate.setDate(currentDay.getDate() + 1);
    return tomorrowsDate;
  };

  const getTomorrowsDateLastYear = (): Date => {
    const tomorrowsDateLastYear = new Date();
    tomorrowsDateLastYear.setFullYear(currentDay.getFullYear() - 1);
    return tomorrowsDateLastYear;
  };

  const getTitleForValue = ({
    date,
    countInMinutes,
  }: PomodoroDayProps): string =>
    countInMinutes !== undefined &&
    `${format(new Date(date), "MMM dd, yyyy")} - ${countInMinutes} minute${
      countInMinutes === 1 ? "" : "s"
    } of study`;

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

  const getClassForValue = (countInMinutes: number) =>
    countInMinutes
      ? `color-scale-${findValueCountRange(countInMinutes)}`
      : "color-empty";

  return (
    <div className={styles["react-calendar-heatmap"]}>
      <CalendarHeatmap
        values={pomodoroDays ?? []}
        showWeekdayLabels
        startDate={formatDate(getTomorrowsDateLastYear())}
        endDate={formatDate(getTomorrowsDate())}
        titleForValue={(value: PomodoroDayProps) => getTitleForValue(value)}
        classForValue={({ countInMinutes }: PomodoroDayProps) =>
          styles[getClassForValue(countInMinutes)]
        }
      />
    </div>
  );
};
