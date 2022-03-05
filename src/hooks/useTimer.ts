import { useRef, useState } from "react";
import { usePomodoro } from "../contexts/pomodoroContext";

type UseTimerData = {
  timeInSeconds: number;
  isActive: boolean;
  isPaused: boolean;
  handleStart: () => any;
  handlePause: () => any;
  handleResume: () => any;
  handleStop: () => any;
};

export const useTimer = (initialState: number): UseTimerData => {
  const {
    isStudy,
    totalPomodorosCompleted,
    status,
    handleChangeStatus,
    saveStudyProgressInFirebase,
    saveShortBreakProgressInFirebase,
    saveLongBreakProgressInFirebase,
  } = usePomodoro();

  const [timeInSeconds, setTimeInSeconds] = useState(initialState);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const countRef = useRef(null);

  const NUM_NEEDED_FOR_LONG_BREAK = 4;

  const toggleStart = () => {
    handleChangeStatus("start");
    // setTimeInSeconds(handleMinutesToSeconds(25));
    setTimeInSeconds(1);
  };

  const toggleStudy = () => {
    handleChangeStatus("study");
    // setTimeInSeconds(handleMinutesToSeconds(25));
    setTimeInSeconds(1);
  };

  const toggleShortBreak = () => {
    handleChangeStatus("short-break");
    // setTimeInSeconds(handleMinutesToSeconds(5));
    setTimeInSeconds(1);
  };

  const toggleLongBreak = () => {
    handleChangeStatus("long-break");
    // setTimeInSeconds(handleMinutesToSeconds(15));
    setTimeInSeconds(1);
  };

  const handleStart = () => {
    toggleStudy();
    setIsActive(true);
    setIsPaused(true);
    handleCountdown(false);
  };

  const handleResume = () => {
    setIsPaused(true);
    handleCountdown(true);
  };

  const verifyAndSaveProgressInFirebase = async () => {
    if (status === "start" || status === "study") { 
      await saveStudyProgressInFirebase();
    } else if (totalPomodorosCompleted > 0) {
      await saveShortBreakProgressInFirebase();
    } else {
      await saveLongBreakProgressInFirebase();
    }
  };

  const handleCountdown = (bool: boolean) => {
    countRef.current = setInterval(async () => {
      let isEnd = false;

      setTimeInSeconds((timeInSeconds: number) => {
        if (timeInSeconds === 0) {
          toggleSituation();
          return 0;
        }
        if (timeInSeconds - 1 === 0) {
          isEnd = true;
        }
        return timeInSeconds - 1;
      });

      if (isEnd) {
        await verifyAndSaveProgressInFirebase();
      }
    }, 1000);

    function toggleSituation() {
      // gabiarra provisória
      if (isStudy === bool) {
        if (totalPomodorosCompleted === NUM_NEEDED_FOR_LONG_BREAK) {
          toggleLongBreak();
        } else {
          toggleShortBreak();
        }
      } else {
        toggleStudy();
      }
      handlePause();
    }
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(false);
  };

  const handleStop = () => {
    if (handleConfirmStop()) {
      handleReset();
    }

    function handleReset() {
      clearInterval(countRef.current);
      setIsActive(false);
      setIsPaused(false);
      toggleStart();
    };

    function handleConfirmStop(): boolean {
      const confirm = window.confirm(
        "Tem certeza que deseja parar o ciclo? O processo atual será perdido."
      );
      return Boolean(confirm);
    };
  };

  return {
    timeInSeconds,
    isActive,
    isPaused,
    handleStart,
    handlePause,
    handleResume,
    handleStop,
  };
};
