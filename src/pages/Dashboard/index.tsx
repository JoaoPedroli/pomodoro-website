import { useEffect, useState } from "react";
import { CalendarHeatMap } from "../../components/CalendarHeatMap";
import { Loader } from "../../components/Loader";
import { MenuProfileOptions } from "../../components/MenuProfileOptions";
import { usePomodoro } from "../../contexts/pomodoroContext";
import firebase from "../../database/firebaseConnection";
import styles from "./styles.module.scss";

export const Dashboard = () => {
  const { handleChangeStatus } = usePomodoro();

  const [pomodoroDays, setPomodoroDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const resetThemeAndProcess = () => handleChangeStatus("start");
  const getUid = () => JSON.parse(localStorage.getItem("UserData")).uid;

  useEffect(() => {
    resetThemeAndProcess();
    fetchData();
    
    async function fetchData() {
      await getPomodoroDays();
      setIsLoading(false);
    }
  }, []);

  async function getPomodoroDays() {
    const array = new Array(366);
    let currentIndex = 0;

    await firebase
      .firestore()
      .collection("users")
      .doc(getUid())
      .collection("study-time-days")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const intervalBetweenTodayAndSnapshotDay = new Date().getDate() - new Date(doc.id).getDate();
          array[intervalBetweenTodayAndSnapshotDay] = {
            date: doc.id,
            countInMinutes: doc.data().duration,
          }, ++currentIndex;
        });
      });
    
    for(let i = 0; i < 366; ++i) {
      if(!array[i]?.date) {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() - i);
        array[i] = {
          date: String(newDate),
          countInMinutes: 0,
        };
      }
    }

    setPomodoroDays(array);
  }

  return (
    <div className={styles.container}>
      <MenuProfileOptions />

      {isLoading
      ? <Loader />
      : <div className={styles.subcontainer}>
          <h1>Dashboard</h1>

          <CalendarHeatMap pomodoroDays={pomodoroDays} />
        </div>
      }
    </div>
  );
};
