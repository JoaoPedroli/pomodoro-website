import { useRef, useState } from "react";
import { StatusContext } from "../contexts/pomodoroContext";

export interface UseTimerProps {
	timeInSeconds: number;
	isActive: boolean;
	isPaused: boolean;
	handleStart: () => any;
	handlePause: () => any;
	handleResume: () => any;
	handleStop: () => any;
}

export interface PomodoroDataProps {
	isStudy: boolean;
	totalPomodorosCompleted: number;
	status: StatusContext;
	saveStudyProgressInFirebase: () => Promise<any>;
	saveShortBreakProgressInFirebase: () => Promise<any>;
	saveLongBreakProgressInFirebase: () => Promise<any>;
	handleChangeStatus: (status: string) => any;
	convertMinutesToSeconds: (minutes: number) => number;
}

export const useTimer = (pomodoroData: PomodoroDataProps): UseTimerProps => {
	const {
		isStudy,
		totalPomodorosCompleted,
		status,
		handleChangeStatus,
		saveStudyProgressInFirebase,
		saveShortBreakProgressInFirebase,
		saveLongBreakProgressInFirebase,
		convertMinutesToSeconds,
	} = pomodoroData;

	const [timeInSeconds, setTimeInSeconds] = useState(
		convertMinutesToSeconds(25)
	);
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const countRef = useRef(null);

	const NUM_NEEDED_FOR_LONG_BREAK = 4;
	const DEBUG = true;

	const getStudyTime = () => (DEBUG ? 1 : convertMinutesToSeconds(25));
	const getShortBreakTime = () => (DEBUG ? 1 : convertMinutesToSeconds(5));
	const getLongBreakTime = () => (DEBUG ? 1 : convertMinutesToSeconds(15));

	const toggleStart = () => {
		handleChangeStatus("start");
		setTimeInSeconds(getStudyTime());
	};

	const toggleStudy = () => {
		handleChangeStatus("study");
		setTimeInSeconds(getStudyTime());
	};

	const toggleShortBreak = () => {
		handleChangeStatus("short-break");
		setTimeInSeconds(getShortBreakTime());
	};

	const toggleLongBreak = () => {
		handleChangeStatus("long-break");
		setTimeInSeconds(getLongBreakTime());
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
		}

		function handleConfirmStop(): boolean {
			const confirm = window.confirm(
				"Are you sure you want to stop the cycle? The current process will be lost."
			);
			return Boolean(confirm);
		}
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
