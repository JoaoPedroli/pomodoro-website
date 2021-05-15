import { useState, useRef } from 'react';

import { usePomodoro } from '../contexts/pomodoroContext';

type UseTimerData = {
  timeInSeconds: number,
  isActive: boolean,
  isPaused: boolean,
  handleStart: () => any,
  handlePause: () => any,
  handleResume: () => any,
  handleStop: () => any,
}

export const useTimer = (initialState: number): UseTimerData => {
  const {
    isStudy, totalPomodorosCompleted,
    handleChangeStatus,
    handleMinutesToSeconds,
  } = usePomodoro();

  const [ timeInSeconds, setTimeInSeconds ] = useState(initialState);
  const [ isActive, setIsActive ] = useState(false);
  const [ isPaused, setIsPaused ] = useState(false);

  const countRef = useRef(null);

  const NUM_NEEDED_FOR_LONG_BREAK = 3;

  const toggleStart = () => {
    handleChangeStatus('start');
    setTimeInSeconds(handleMinutesToSeconds(25));
    // setTimeInSeconds(1);
  };

  const toggleStudy = () => {
    handleChangeStatus('study');
    setTimeInSeconds(handleMinutesToSeconds(25));
    // setTimeInSeconds(1);
  };

  const toggleShortBreak = () => {
    handleChangeStatus('short break');
    setTimeInSeconds(handleMinutesToSeconds(5));
    // setTimeInSeconds(1);
  };

  const toggleLongBreak = () => {
    handleChangeStatus('long break');
    setTimeInSeconds(handleMinutesToSeconds(15));
    // setTimeInSeconds(1);
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
  }

  const handleCountdown = (bool: boolean) => {
    const toggleSituation = () => {
      if(isStudy === bool) { // gabiarra provisória
        if(totalPomodorosCompleted === NUM_NEEDED_FOR_LONG_BREAK) {
          toggleLongBreak();
        } else {
          toggleShortBreak();
        }
      } else {
        toggleStudy();
      }
      handlePause();
    }

    countRef.current = setInterval(() => {
      setTimeInSeconds((timeInSeconds: number) => {
        if(timeInSeconds === 0) {
          toggleSituation();
          return timeInSeconds;
        }
        return timeInSeconds - 1;
      });
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(false);
  };

  const handleStop = () => {
    const handleConfirmStop = (): boolean => {
      const confirm = window.confirm('Tem certeza que deseja parar o ciclo? O processo atual será perdido.');
      return Boolean(confirm);
    };

    const handleReset = () => {
      clearInterval(countRef.current);
      setIsActive(false);
      setIsPaused(false);
      toggleStart();
    };

    if(handleConfirmStop()) {
      handleReset();
    }
  };

  return {
    timeInSeconds,
    isActive, isPaused,
    handleStart, handlePause, handleResume, handleStop,
  };
}
