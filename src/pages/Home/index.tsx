import { ProgressBar } from "react-bootstrap";
import { ButtonTimer } from "../../components/ButtonTimer";
import { Loader } from "../../components/Loader";
import { usePomodoro } from "../../contexts/pomodoroContext";
import { formatTime } from "../../utils/formatTime";
import styles from "./styles.module.scss";

export const Home = () => {
  const {
    isStart,
    isStudy,
    isShortBreak,
    isLoading,
    convertMinutesToSeconds,
    timeInSeconds,
    isPaused,
    handleStart,
    handlePause,
    handleResume,
    handleStop,
  } = usePomodoro();

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.subcontainer}>
          <Loader />
        </div>
      ) : (
        <div className={styles.subcontainer}>
          {isStart || (
            <ProgressBar
              variant={isStudy ? "warning" : "info"}
              min={0}
              now={timeInSeconds}
              max={
                isStudy
                  ? convertMinutesToSeconds(25)
                  : isShortBreak
                  ? convertMinutesToSeconds(5)
                  : convertMinutesToSeconds(15)
              }
              id={styles.progressTimer}
            />
          )}

          <h2 id={styles.title}>
            {isStart
              ? "Study with more focus"
              : isStudy
              ? "Studying"
              : isShortBreak
              ? "Short Break"
              : "Long Break"}
          </h2>

          <h2 id={styles.time}>{formatTime(timeInSeconds)}</h2>

          <ButtonTimer
            isPaused={isPaused}
            handleStart={handleStart}
            handlePause={handlePause}
            handleResume={handleResume}
          />

          {isStart || (
            <button
              style={{
                marginTop: 14,
                fontSize: 25,
              }}
              className="red-button"
              onClick={handleStop}
            >
              Stop
            </button>
          )}
        </div>
      )}
    </div>
  );
};
