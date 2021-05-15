import { useEffect, useState } from "react";

import styles from "./styles.module.scss";

import firebase from "../../database/firebaseConnection";

import { CalendarHeatMap } from "../../components/CalendarHeatMap";
import { MenuProfileOptions } from "../../components/MenuProfileOptions";

import { usePomodoro } from "../../contexts/pomodoroContext";
import { Loader } from "../../components/Loader";

export const Dashboard = () => {
  const { handleChangeStatus } = usePomodoro();

  const [pomodoroDays, setPomodoroDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resetThemeAndProcess = () => handleChangeStatus("start");

    const getUid = () => JSON.parse(localStorage.getItem("UserData")).uid;

    const getPomodoroDays = async () => {
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

    const doIt = async () => {
      resetThemeAndProcess();
      await getPomodoroDays();
      setLoading(false);
    };

    doIt();
  }, []);

  if(loading) {
    return <div className={styles.container}>
      <Loader/>
    </div>
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
