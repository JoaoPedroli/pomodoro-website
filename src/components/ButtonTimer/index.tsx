import { usePomodoro } from "../../contexts/pomodoroContext";

type ButtonTimerTypes = {
  isPaused: boolean;
  handleStart: () => any;
  handlePause: () => any;
  handleResume: () => any;
};

export const ButtonTimer = ({
  isPaused,
  handleStart,
  handlePause,
  handleResume,
}: ButtonTimerTypes) => {
  const { status, isStart } = usePomodoro();

  return isStart ? (
    <button
      style={{ width: "100%" }}
      className="default-button"
      onClick={handleStart}
    >
      Start
    </button>
  ) : (
    <button
      style={{ width: "100%" }}
      className={
        status === "start"
          ? "default-button"
          : status === "study"
          ? "yellow-button"
          : status === "short-break"
          ? "blue-button"
          : "blue1-button"
      }
      onClick={isPaused ? handlePause : handleResume}
    >
      {isPaused ? "Pause" : "Resume"}
    </button>
  );
};
