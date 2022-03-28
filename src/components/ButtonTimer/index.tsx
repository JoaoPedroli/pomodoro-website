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
	const { theme, isStart } = usePomodoro();

	return isStart ? (
		<button
			style={{ width: "100%" }}
			className="primary-button"
			onClick={handleStart}
		>
			Start
		</button>
	) : (
		<button
			style={{ width: "100%" }}
			className={`${theme}-button`}
			onClick={isPaused ? handlePause : handleResume}
		>
			{isPaused ? "Pause" : "Resume"}
		</button>
	);
};
