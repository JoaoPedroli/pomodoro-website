import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";

import firebase from "../database/firebaseConnection";

import { useAuth } from "./authContext";

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
  const { userData } = useAuth();
  const uid = userData?.uid;

  const [isStart, setIsStart] = useState(true);
  const [isStudy, setIsStudy] = useState(false);
  const [isShortBreak, setIsShortBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [theme, setTheme] = useState("var(--primary)");
  const [themeShadow, setThemeShadow] = useState("var(--primary-shadow)");
  const [totalPomodorosCompleted, setTotalPomodorosCompleted] = useState(-1);
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

    const handleChangeIsStart = (paramIsStart: boolean) => {
      const toggleThemeStart = () => {
        setTheme("var(--primary)");
        setThemeShadow("var(--primary-shadow)");
      };

      if(paramIsStart) {
        setTotalPomodorosCompleted(-1);
        toggleThemeStart();
      }

      setIsStart(paramIsStart);
    };

    const handleChangeIsStudy = async (paramIsStudy: boolean) => {
      const toggleThemeStudy = () => {
        setTheme("var(--study)");
        setThemeShadow("var(--study-shadow)");
      };

      const wasStart = Boolean(totalPomodorosCompleted === -1)
      if (paramIsStudy && !wasStart) {
        const wasShortBreak = Boolean(totalPomodorosCompleted > 0);
        let error = {};
        if (wasShortBreak) {
          error = (await handleAddShortBreakTimeAll()).error;
        } else {
          error = (await handleAddLongBreakTimeAll()).error;
        }

        if (error) {
          toast.error(
            "Oops! An error occurred while saving your progress, please contact support.",
          );

          console.log(error);
        }
      }

      paramIsStudy && toggleThemeStudy();
      setIsStudy(paramIsStudy);
    };

    const handleChangeIsShortBreak = async (paramIsShortBreak: boolean) => {
      const toggleThemeShortBreak = () => {
        setTheme("var(--short-break)");
        setThemeShadow("var(--short-break-shadow)");
      };

      const handleAddOnePomodoro = () => {
        const isStartValue = Boolean(totalPomodorosCompleted === -1);
        const increment = isStartValue ? 2 : 1;
        setTotalPomodorosCompleted(totalPomodorosCompleted + increment);
      };

      if (paramIsShortBreak) {
        handleAddOnePomodoro();

        const { error } = await handleAddPomodoroDayMinutes();
        const { error: error2 } = await handleAddStudyTimeAll();
        if (error || error2) {
          toast.error(
            "Oops! An error occurred while saving your progress, please contact support.",
          );
          console.log(error ?? "");
          console.log(error2 ?? "");
        } else {
          toast.success(
            "Congratulations you finished 25 minutes of study, they were added to your history today, check the dashboard later. Time to relax ^^",
          );
        }

        toggleThemeShortBreak();
      }

      setIsShortBreak(paramIsShortBreak);
    };

    const handleChangeIsLongBreak = async (paramIsLongBreak: boolean) => {
      const toggleThemeLongBreak = () => {
        setTheme("var(--long-break)");
        setThemeShadow("var(--long-break-shadow)");
      };

      const handleRestartTotalPomodoro = () => setTotalPomodorosCompleted(0);

      if (paramIsLongBreak) {
        handleRestartTotalPomodoro();

        const { error } = await handleAddPomodoroDayMinutes();
        const { error: error2 } = await handleAddStudyTimeAll();
        if (error) {
          toast.error(
            "Oops! An error occurred while saving your progress, please contact support.",
          );
          console.log(error ?? "");
          console.log(error2 ?? "");
        } else {
          toast.success(
            "Congratulations you finished 25 minutes of study, they were added to your history today, check the dashboard later. Time to relax ^^",
          );
        }

        toggleThemeLongBreak();
      }

      setIsLongBreak(paramIsLongBreak);
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
