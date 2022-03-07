import { useEffect, useState } from "react";
import { CalendarHeatMap } from "../../components/CalendarHeatMap";
import { Loader } from "../../components/Loader";
import { MenuProfileOptions } from "../../components/MenuProfileOptions";
import { usePomodoro } from "../../contexts/pomodoroContext";
import firebase from "../../database/firebaseConnection";
import styles from "./styles.module.scss";

type StudyTimeDaysProps = {
  date: string;
  countInMinutes: number;
};

export const Dashboard = () => {
  const { handleChangeStatus } = usePomodoro();

  const [pomodoroDays, setPomodoroDays] = useState([]);
  const [allStudyTime, setAllStudyTime] = useState(0);
  const [allShortBreakTime, setAllShortBreakTime] = useState(0);
  const [allLongBreakTime, setAllLongBreakTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getUid = () => JSON.parse(localStorage.getItem("UserData")).uid;
  const getPlural = (value: number) => (value === 1 ? "" : "s");

  useEffect(() => {
    fetchData();

    async function fetchData() {
      const { newStudyDays, newAllStudyTime } =
        await getStudyDaysAndAllStudyTime();
      const newShortBreakTime = await getAllShortBreakTime();
      const newLongBreakTime = await getAllLongBreakTime();
      setPomodoroDays(newStudyDays);
      setAllStudyTime(newAllStudyTime);
      setAllShortBreakTime(newShortBreakTime);
      setAllLongBreakTime(newLongBreakTime);
      setIsLoading(false);
    }
  }, []);

  async function getStudyDaysAndAllStudyTime(): Promise<{
    newStudyDays: Array<StudyTimeDaysProps>;
    newAllStudyTime: number;
  }> {
    const newStudyDays = new Array<StudyTimeDaysProps>(366);
    let newAllStudyTime = 0;
    let currentIndex = 0;

    await firebase
      .firestore()
      .collection("users")
      .doc(getUid())
      .collection("study-time-days")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const intervalBetweenTodayAndSnapshotDay =
            new Date().getDate() - new Date(doc?.id).getDate();

          const { duration } = doc.data();

          newAllStudyTime += duration;

          (newStudyDays[intervalBetweenTodayAndSnapshotDay] = {
            date: doc?.id,
            countInMinutes: duration,
          }),
            ++currentIndex;
        });
      });

    for (let i = 0; i < 366; ++i) {
      if (!newStudyDays[i]?.date) {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() - i);
        newStudyDays[i] = {
          date: String(newDate),
          countInMinutes: 0,
        };
      }
    }

    return { newStudyDays, newAllStudyTime };
  }

  async function getAllShortBreakTime(): Promise<number> {
    let newAllShortBreakTime = 0;

    await firebase
      .firestore()
      .collection("users")
      .doc(getUid())
      .collection("short-break-time-days")
      .get()
      .then((snapshot) => {
        snapshot.forEach(
          (doc) => (newAllShortBreakTime += doc.data()?.duration ?? 0)
        );
      });

    return newAllShortBreakTime;
  }

  async function getAllLongBreakTime(): Promise<number> {
    let newAllShortBreakTime = 0;

    await firebase
      .firestore()
      .collection("users")
      .doc(getUid())
      .collection("long-break-time-days")
      .get()
      .then((snapshot) => {
        snapshot.forEach(
          (doc) => (newAllShortBreakTime += doc.data()?.duration ?? 0)
        );
      });

    return newAllShortBreakTime;
  }

  return (
    <div className={styles.container}>
      <MenuProfileOptions />

      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.subcontainer}>
          <h1>Dashboard</h1>

          <CalendarHeatMap pomodoroDays={pomodoroDays} />

          <div className={styles.statisticsContainer}>
            <div
              className={styles.containerAllTime}
              style={{ borderRadius: "10px 0 0 10px" }}
            >
              <span>Total Study Time</span>
              <span style={{ color: "var(--yellow)" }}>
                {allStudyTime} Minute{getPlural(allStudyTime)}
              </span>
            </div>
            <div className="div-column">
              <div
                className={styles.containerAllTime}
                style={{ borderRadius: "0 10px 0 0" }}
              >
                <span>Total Short Break Time</span>
                <span style={{ color: "var(--light-blue)" }}>
                  {allShortBreakTime} Minute{getPlural(allShortBreakTime)}
                </span>
              </div>
              <div
                className={styles.containerAllTime}
                style={{ borderRadius: "0 0 10px 0" }}
              >
                <span>Total Long Break Time</span>
                <span style={{ color: "var(--blue)" }}>
                  {allLongBreakTime} Minute{getPlural(allLongBreakTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
