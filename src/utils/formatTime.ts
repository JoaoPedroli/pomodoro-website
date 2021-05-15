export const formatTime = (timeInSeconds) => {
  const getSeconds = `0${timeInSeconds % 60}`.slice(-2);
  const timeInMinutes = Math.floor(timeInSeconds / 60);
  const getMinutes = `0${timeInMinutes % 60}`.slice(-2);
  
  return `${getMinutes} : ${getSeconds}`;
};
