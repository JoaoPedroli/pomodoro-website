import { createContext, ReactNode, useContext, useState } from "react";
import { format } from "date-fns";

import firebase from "../database/firebaseConnection";

import { useAuth } from "./authContext";
import Toast from "../components/Toast";

type PomodoroContextData = {
  isStart: boolean;
  isStudy: boolean;
  isShortBreak: boolean;
  isLongBreak: boolean;
  isLoading: boolean,
  totalPomodorosCompleted: number;
  theme: string;
  themeShadow: string;
  handleChangeStatus: (status: string) => any;
  handleMinutesToSeconds: (minutes: number) => number;
};

type PomodoroContextProviderProps = {
  children: ReactNode;
};

export const PomodoroContext = createContext({} as PomodoroContextData);

export const PomodoroContextProvider = (
  { children }: PomodoroContextProviderProps,
) => {
  const { isSigned, userData } = useAuth();
  const uid = userData?.uid;

  const [isStart, setIsStart] = useState(true);
  const [isStudy, setIsStudy] = useState(false);
  const [isShortBreak, setIsShortBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [theme, setTheme] = useState("var(--primary)");
  const [themeShadow, setThemeShadow] = useState("var(--primary-shadow)");
  const [totalPomodorosCompleted, setTotalPomodorosCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleMinutesToSeconds = (minutes: number): number => minutes * 60;

  const getAndIncreaseDuration = async (
    location: {
      collection: string;
      doc: string;
    },
    increment: number,
  ): Promise<{ error?: {} }> => {
    const { collection, doc } = location;
    let duration;

    const get = async () => {
      await firebase.firestore()
        .collection("users").doc(uid)
        .collection(collection).doc(doc).get()
        .then((doc) => duration = doc.data()?.duration ?? 0);
    };

    const increase = async (): Promise<{ error?: {} }> => {
      return await firebase.firestore().collection("users").doc(uid)
        .collection(collection).doc(doc).set({
          duration: duration + increment,
        })
        .then(() => {
          return {};
        })
        .catch((error) => {
          return { error };
        });
    };

    await get();
    return await increase();
  };

  const handleAddStudyTimeAll = async (): Promise<{ error?: {} }> => {
    const location = {
      collection: "pomodoro-time-all",
      doc: "study",
    };

    const increment = 25;

    return await getAndIncreaseDuration(location, increment);
  };

  const handleAddShortBreakTimeAll = async (): Promise<{ error?: {} }> => {
    const location = {
      collection: "pomodoro-time-all",
      doc: "short-break",
    };

    const increment = 5;

    return await getAndIncreaseDuration(location, increment);
  };

  const handleAddLongBreakTimeAll = async (): Promise<{ error?: {} }> => {
    const location = {
      collection: "pomodoro-time-all",
      doc: "long-break",
    };

    const increment = 15;

    return await getAndIncreaseDuration(location, increment);
  };

  const handleAddPomodoroDayMinutes = async (): Promise<{ error?: {} }> => {
    const date = format(new Date(), "yyyy-MM-dd");

    const location = {
      collection: "study-time-days",
      doc: date,
    };

    const increment = 25;

    return await getAndIncreaseDuration(location, increment);
  };

  const handleChangeStatus = async (status: string) => {
    setIsLoading(true);

    const handleChangeIsStart = (p_IsStart: boolean) => {
      if(p_IsStart) {
        setTotalPomodorosCompleted(0);
        toggleThemeStart();
      }
      setIsStart(p_IsStart);

      function toggleThemeStart() {
        setTheme("var(--primary)");
        setThemeShadow("var(--primary-shadow)");
      }
    };

    const handleChangeIsStudy = async (p_IsStudy: boolean) => {
      const wasStart = Boolean(totalPomodorosCompleted === 0)
      if (p_IsStudy && isSigned && !wasStart) {
        saveProgressInFirebase();
      }
      p_IsStudy && toggleThemeStudy();
      setIsStudy(p_IsStudy);

      function toggleThemeStudy() {
        setTheme("var(--study)");
        setThemeShadow("var(--study-shadow)");
      }

      async function saveProgressInFirebase() {
        const wasShortBreak = Boolean(totalPomodorosCompleted > 0);
        let error = {};
        if (wasShortBreak) {
          error = (await handleAddShortBreakTimeAll()).error;
        } else {
          error = (await handleAddLongBreakTimeAll()).error;
        }

        if (error) {
          Toast.error();
          console.log(error);
        }
      }
    };

    const handleChangeIsShortBreak = async (p_IsShortBreak: boolean) => {
      if (p_IsShortBreak) {
        handleAddOnePomodoro();

        if(isSigned) await saveProgressInFirebase();

        toggleThemeShortBreak();
      }
      setIsShortBreak(p_IsShortBreak);


      function handleAddOnePomodoro() {
        const isStartValue = Boolean(totalPomodorosCompleted === 0);
        const increment = isStartValue ? 2 : 1;
        setTotalPomodorosCompleted(totalPomodorosCompleted + increment);
      }

      async function saveProgressInFirebase() {
        const { error } = await handleAddPomodoroDayMinutes();
        const { error: error2 } = await handleAddStudyTimeAll();
        if (error || error2) {
          Toast.error();
          console.log(error ?? "");
          console.log(error2 ?? "");
        } else {
          Toast.success(
            "Congratulations you finished 25 minutes of study, they were added to your history today, check the dashboard later. Time to relax ^^",
          );
        }
      }

      function toggleThemeShortBreak() {
        setTheme("var(--short-break)");
        setThemeShadow("var(--short-break-shadow)");
      }
    };

    const handleChangeIsLongBreak = async (p_IsLongBreak: boolean) => {
      if (p_IsLongBreak) {
        handleRestartTotalPomodoro();

        if(isSigned) await saveProgessinFirebase();

        toggleThemeLongBreak();
      }
      setIsLongBreak(p_IsLongBreak);


      function handleRestartTotalPomodoro() {
        setTotalPomodorosCompleted(0);
      }

      async function saveProgessinFirebase() {
        const { error } = await handleAddPomodoroDayMinutes();
        const { error: error2 } = await handleAddStudyTimeAll();
        if (error) {
          Toast.error();
          console.log(error ?? "");
          console.log(error2 ?? "");
        } else {
          Toast.success(
            "Congratulations you finished 25 minutes of study, they were added to your history today, check the dashboard later. Time to relax ^^",
          );
        }
      }

      function toggleThemeLongBreak() {
        setTheme("var(--long-break)");
        setThemeShadow("var(--long-break-shadow)");
      }
    };

    handleChangeIsStart(Boolean(status === "start"));
    await handleChangeIsStudy(Boolean(status === "study"));
    await handleChangeIsShortBreak(Boolean(status === "short break"));
    await handleChangeIsLongBreak(Boolean(status === "long break"));

    setIsLoading(false);
  };

  return (
    <PomodoroContext.Provider
      value={{
        isStart,
        isStudy,
        isShortBreak,
        isLongBreak,
        isLoading,
        totalPomodorosCompleted,
        theme,
        themeShadow,
        handleChangeStatus,
        handleMinutesToSeconds,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  return useContext(PomodoroContext);
};
