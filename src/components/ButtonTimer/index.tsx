import styles from "./styles.module.scss";

import { usePomodoro } from "../../contexts/pomodoroContext";

type ButtonTimerTypes = {
  isActive: boolean;
  isPaused: boolean;
  handleStart: () => any;
  handlePause: () => any;
  handleResume: () => any;
  handleStop: () => any;
};

export const ButtonTimer = ({
  isPaused,
  handleStart,
  handlePause,
  handleResume,
}: ButtonTimerTypes) => {
  const { theme, themeShadow, isStart } = usePomodoro();

  return isStart
    ? <button
      id={styles.buttonTimer}
      style={{
        background: theme,
        boxShadow: `${themeShadow} 0 6px 0`,
      }}
      onClick={handleStart}
      >
        Start
      </button>

    : <button
      id={styles.buttonTimer}
      style={{
        background: theme,
        boxShadow: !isPaused && `${themeShadow} 0 6px 0`,
        marginTop: isPaused && 6,
      }}
      onClick={isPaused ? handlePause : handleResume}
      >
        {isPaused ? "Pause" : "Resume"}
      </button>;
};
