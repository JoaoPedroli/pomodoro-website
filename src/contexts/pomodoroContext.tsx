import { format, getDate } from "date-fns";
import { createContext, ReactNode, useContext, useState } from "react";
import Toast from "../components/Toast";
import firebase from "../database/firebaseConnection";
import { useAuth } from "./authContext";

type StatusContext = "start" | "study" | "short-break" | "long-break";

type PomodoroContextData = {
  isStart: boolean;
  isStudy: boolean;
  isShortBreak: boolean;
  isLongBreak: boolean;
  isLoading: boolean;
  totalPomodorosCompleted: number;
  theme: string;
  themeShadow: string;
  status: StatusContext;
  handleChangeStatus: (status: string) => any;
  handleMinutesToSeconds: (minutes: number) => number;
};

type PomodoroContextProviderProps = {
  children: ReactNode;
};

export const PomodoroContext = createContext<PomodoroContextData | null>(null);

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
  const [themeShadow, setThemeShadow] = useState("var(--dark-primary)");
  const [totalPomodorosCompleted, setTotalPomodorosCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleMinutesToSeconds = (minutes: number): number => minutes * 60;

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

  const handleChangeStatus = async (p_Status: StatusContext) => {
    setIsLoading(true);
    setStatus(p_Status);
    handleChangeIsStart(Boolean(p_Status === "start"));
    await handleChangeIsStudy(Boolean(p_Status === "study"));
    await handleChangeIsShortBreak(Boolean(p_Status === "short-break"));
    await handleChangeIsLongBreak(Boolean(p_Status === "long-break"));
    setIsLoading(false);

    function handleChangeIsStart(p_IsStart: boolean) {
      if (p_IsStart) {
        setTotalPomodorosCompleted(0);
        toggleThemeStart();
      }
      setIsStart(p_IsStart);

      function toggleThemeStart() {
        setTheme("var(--primary)");
        setThemeShadow("var(--dark-primary)");
      }
    }

    async function handleChangeIsStudy(p_IsStudy: boolean) {
      const wasStart = Boolean(totalPomodorosCompleted === 0);
      if (p_IsStudy && isSigned && !wasStart) {
        await saveProgressInFirebase();
      }
      p_IsStudy && toggleThemeStudy();
      setIsStudy(p_IsStudy);

      function toggleThemeStudy() {
        setTheme("var(--yellow)");
        setThemeShadow("var(--dark-yellow)");
      }

      async function saveProgressInFirebase() {
        const wasShortBreak = Boolean(totalPomodorosCompleted > 0);
        let error = {};
        if (wasShortBreak) {
          error = (await handleAddShortBreakTime()).error;
        } else {
          error = (await handleAddLongBreakTime()).error;
        }

        if (error) {
          Toast.error();
          console.log(error);
        }
      }
    }

    async function handleChangeIsShortBreak(p_IsShortBreak: boolean) {
      if (p_IsShortBreak) {
        handleAddOnePomodoro();

        if (isSigned) await saveProgressInFirebase();

        toggleThemeShortBreak();
      }
      setIsShortBreak(p_IsShortBreak);

      function handleAddOnePomodoro() {
        const isStartValue = Boolean(totalPomodorosCompleted === 0);
        const increment = isStartValue ? 2 : 1;
        setTotalPomodorosCompleted(totalPomodorosCompleted + increment);
      }

      async function saveProgressInFirebase() {
        const { error } = await handleAddStudyTime();
        if (error) {
          Toast.error();
          console.log(error ?? "");
        } else {
          Toast.success(
            "Congratulations you finished 25 minutes of study, they were added to your history today, check the dashboard later. Time to relax ^^"
          );
        }
      }

      function toggleThemeShortBreak() {
        setTheme("var(--blue)");
        setThemeShadow("var(--dark-blue)");
      }
    }

    async function handleChangeIsLongBreak(p_IsLongBreak: boolean) {
      if (p_IsLongBreak) {
        handleRestartTotalPomodoro();

        if (isSigned) await saveProgessinFirebase();

        toggleThemeLongBreak();
      }
      setIsLongBreak(p_IsLongBreak);

      function handleRestartTotalPomodoro() {
        setTotalPomodorosCompleted(0);
      }

      async function saveProgessinFirebase() {
        const { error } = await handleAddStudyTime();
        if (error) {
          Toast.error();
          console.log(error ?? "");
        } else {
          Toast.success(
            "Congratulations you finished 25 minutes of study, they were added to your history today, check the dashboard later. Time to relax ^^"
          );
        }
      }

      function toggleThemeLongBreak() {
        setTheme("var(--light-blue)");
        setThemeShadow("var(--dark-light-blue)");
      }
    }
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
        status,
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
