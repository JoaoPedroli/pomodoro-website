import { ProgressBar } from 'react-bootstrap';

import styles from './styles.module.scss';

import { formatTime } from '../../utils/formatTime';
import { useTimer } from '../../hooks/useTimer';

import { ButtonTimer } from '../../components/ButtonTimer';

import { usePomodoro } from '../../contexts/pomodoroContext';
import { Loader } from '../../components/Loader';

export const Home = () => {
  const {
    isStart, isStudy, isShortBreak,
    isLoading, handleMinutesToSeconds,
  } = usePomodoro();

  const {
    timeInSeconds,
    isActive, isPaused,
    handleStart, handlePause, handleResume, handleStop,
  } = useTimer(handleMinutesToSeconds(25));

  return (
    <div className={styles.container}>
      {isLoading
      ? <div className={styles.subcontainer}>
          <Loader/>
        </div>

      : <div className={styles.subcontainer}>
          {isStart ||
            <ProgressBar
            variant={ isStudy ? 'warning' : 'info' }
            min={0} now={timeInSeconds} max={
              isStudy ? handleMinutesToSeconds(25) :
              isShortBreak ? handleMinutesToSeconds(5)
              : handleMinutesToSeconds(15)
            }
            id={styles.progressTimer}
            />
          }

          <h2 id={styles.title}>
            {
            isStart ? 'Study with more focus' :
            isStudy ? 'Studying' :
            isShortBreak ? 'Short Break' :
            'Long Break'
            }
          </h2>

          <h2 id={styles.time}>{formatTime(timeInSeconds)}</h2>

          <ButtonTimer
          isActive={isActive}
          isPaused={isPaused}
          handleStart={handleStart}
          handlePause={handlePause}
          handleResume={handleResume}
          handleStop={handleStop}
          />

          { isStart ||
            <button
            style={{
            padding: !isPaused && '13px 10px',
            marginTop: !isPaused ? 20 : 14,
            }}
            id={styles.closebutton}
            onClick={handleStop}
            >
              Stop
            </button>
          }
        </div>
      }
    </div>
  );
}
