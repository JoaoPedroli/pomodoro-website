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
  const [loading, setLoading] = useState(true);

  const resetThemeAndProcess = () => handleChangeStatus("start");
  const getUid = () => JSON.parse(localStorage.getItem("UserData")).uid;

  useEffect(() => {
    resetThemeAndProcess();
    fetchData();
    setLoading(false);
    
    async function fetchData() {
      await getPomodoroDays();
    }
    
    async function getPomodoroDays() {
      const array = [];

      await firebase
        .firestore()
        .collection("users")
        .doc(getUid())
        .collection("study-time-days")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            array.push({
              date: doc.id,
              countInMinutes: doc.data().duration,
            });
          });
        });

      setPomodoroDays(array);
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <MenuProfileOptions />

      <div className={styles.subcontainer}>
        <h1>Dashboard</h1>

        <CalendarHeatMap pomodoroDays={pomodoroDays} />
      </div>
    </div>
  );
};
