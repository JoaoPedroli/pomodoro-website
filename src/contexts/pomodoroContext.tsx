import { createContext, ReactNode, useContext, useState } from "react";
import Toast from "../components/Toast";
import firebase from "../database/firebaseConnection";
import { useTimer, UseTimerProps } from "../hooks/useTimer";
import { useAuth } from "./authContext";

export type StatusContext = "start" | "study" | "short-break" | "long-break";

export interface PomodoroContextProps extends UseTimerProps {
  isStart: boolean;
  isStudy: boolean;
  isShortBreak: boolean;
  isLongBreak: boolean;
  isLoading: boolean;
  totalPomodorosCompleted: number;
  theme: string;
  darkTheme: string;
  lightTheme: string,
  status: StatusContext;
  saveStudyProgressInFirebase: () => Promise<any>;
  saveShortBreakProgressInFirebase: () => Promise<any>;
  saveLongBreakProgressInFirebase: () => Promise<any>;
  handleChangeStatus: (status: string) => any;
  convertMinutesToSeconds: (minutes: number) => number;
}

type PomodoroContextProviderProps = {
  children: ReactNode;
};

export const PomodoroContext = createContext<PomodoroContextProps | null>(null);

export const PomodoroContextProvider = ({
  children,
}: PomodoroContextProviderProps) => {
  const { isSigned, userData } = useAuth();
  const uid = userData?.uid;

  const [status, setStatus] = useState<StatusContext>("start");
  const [isStart, setIsStart] = useState(true);
  const [isStudy, setIsStudy] = useState(false);
  const [isShortBreak, setIsShortBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [theme, setTheme] = useState("var(--primary)");
  const [darkTheme, setDarkTheme] = useState("var(--dark-primary)");
  const [lightTheme, setLightTheme] = useState("var(--light-primary)");
  const [totalPomodorosCompleted, setTotalPomodorosCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const convertMinutesToSeconds = (minutes: number): number => minutes * 60;

  const getCurrentDateString = () => {
    const currentDay = new Date();
    currentDay.setHours(0), currentDay.setMinutes(0), currentDay.setSeconds(0);
    return `${currentDay}`;
  };

  const getAndIncreaseDuration = async (
    location: {
      collection: string;
      doc: string;
    },
    increment: number
  ): Promise<{ error?: {} }> => {
    const { collection, doc } = location;
    return await handleIncrease();

    async function getDuration() {
      return await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection(collection)
        .doc(doc)
        .get()
        .then((doc) => doc.data()?.duration ?? 0);
    }

    async function handleIncrease(): Promise<{ error?: {} }> {
      let duration = await getDuration();

      return await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection(collection)
        .doc(doc)
        .set({
          duration: duration + increment,
        })
        .then(() => {
          return {};
        })
        .catch((error) => {
          return { error };
        });
    }
  };

  const handleAddStudyTime = async (): Promise<{ error?: {} }> => {
    const location = {
      collection: "study-time-days",
      doc: getCurrentDateString(),
    };

    const increment = 25;

    return await getAndIncreaseDuration(location, increment);
  };

  const handleAddShortBreakTime = async (): Promise<{ error?: {} }> => {
    const location = {
      collection: "short-break-time-days",
      doc: getCurrentDateString(),
    };

    const increment = 5;

    return await getAndIncreaseDuration(location, increment);
  };

  const handleAddLongBreakTime = async (): Promise<{ error?: {} }> => {
    const location = {
      collection: "long-break-time-days",
      doc: getCurrentDateString(),
    };

    const increment = 15;

    return await getAndIncreaseDuration(location, increment);
  };

  async function saveStudyProgressInFirebase() {
    if (!isSigned) {
      Toast.info(
        "Save your progress! Register and get access to your statistics"
      );
      return;
    }

    const { error } = await handleAddStudyTime();
    if (error) {
      Toast.error();
      console.log(error ?? "");
    } else
      Toast.success(
        "Congratulations you finished 25 minutes of study, they were added to your history today, check the dashboard later. Time to relax ^^"
      );
  }

  async function saveShortBreakProgressInFirebase() {
    if (!isSigned) return;

    const error = (await handleAddShortBreakTime()).error;
    if (error) {
      Toast.error();
      console.log(error);
    }
  }

  async function saveLongBreakProgressInFirebase() {
    if (!isSigned) return;

    const error = (await handleAddLongBreakTime()).error;
    if (error) {
      Toast.error();
      console.log(error);
    }
  }

  const handleChangeStatus = async (newStatus: StatusContext) => {
    setIsLoading(true);
    handleChangeIsStart(Boolean(newStatus === "start"));
    await handleChangeIsStudy(Boolean(newStatus === "study"));
    await handleChangeIsShortBreak(Boolean(newStatus === "short-break"));
    await handleChangeIsLongBreak(Boolean(newStatus === "long-break"));
    setStatus(newStatus);
    setIsLoading(false);

    function handleChangeIsStart(newIsStart: boolean) {
      setIsStart(newIsStart);
      if (!newIsStart) return;

      setTotalPomodorosCompleted(0);
      toggleThemeStart();

      function toggleThemeStart() {
        setTheme("var(--primary)");
        setDarkTheme("var(--dark-primary)");
        setLightTheme("var(--light-primary)");
      }
    }

    async function handleChangeIsStudy(newIsStudy: boolean) {
      setIsStudy(newIsStudy);
      if (!newIsStudy) return;

      toggleThemeStudy();

      function toggleThemeStudy() {
        setTheme("var(--yellow)");
        setDarkTheme("var(--dark-yellow)");
        setLightTheme("var(--light-yellow)");
      }
    }

    async function handleChangeIsShortBreak(newIsShortBreak: boolean) {
      setIsShortBreak(newIsShortBreak);
      if (!newIsShortBreak) return;

      handleAddOnePomodoro();
      toggleThemeShortBreak();

      function handleAddOnePomodoro() {
        const isStartValue = Boolean(totalPomodorosCompleted === 0);
        const increment = isStartValue ? 2 : 1;
        setTotalPomodorosCompleted(totalPomodorosCompleted + increment);
      }

      function toggleThemeShortBreak() {
        setTheme("var(--blue)");
        setDarkTheme("var(--dark-blue)");
        setLightTheme("var(--light-blue)");
      }
    }

    async function handleChangeIsLongBreak(newIsLongBreak: boolean) {
      setIsLongBreak(newIsLongBreak);
      if (!newIsLongBreak) return;

      handleRestartTotalPomodoro();
      toggleThemeLongBreak();

      function handleRestartTotalPomodoro() {
        setTotalPomodorosCompleted(0);
      }

      function toggleThemeLongBreak() {
        setTheme("var(--blue1)");
        setDarkTheme("var(--light-blue1)");
        setLightTheme("var(--light-blue1)");
      }
    }
  };

  const pomodoroContextResponse = {
    isStart,
    isStudy,
    isShortBreak,
    isLongBreak,
    isLoading,
    totalPomodorosCompleted,
    theme,
    darkTheme,
    lightTheme,
    status,
    saveStudyProgressInFirebase,
    saveShortBreakProgressInFirebase,
    saveLongBreakProgressInFirebase,
    handleChangeStatus,
    convertMinutesToSeconds,
  };

  const useTimerResponse = useTimer(pomodoroContextResponse);

  return (
    <PomodoroContext.Provider
      value={{
        ...pomodoroContextResponse,
        ...useTimerResponse,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  return useContext(PomodoroContext);
};
