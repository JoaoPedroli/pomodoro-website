export const formatTime = (timeInSeconds = 0) => {
	const formattedSeconds = `0${timeInSeconds % 60}`.slice(-2);
	const timeInMinutes = Math.floor(timeInSeconds / 60);
	const formattedMinutes = `0${timeInMinutes % 60}`.slice(-2);
	const formattedTime = `${formattedMinutes} : ${formattedSeconds}`;

	return formattedTime;
};
