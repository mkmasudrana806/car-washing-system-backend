// convert time to minutes
// 01:25 => 85
export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
};

// conver minute to time format
// 85 => 01:25
export const minuteToTime = (minute: number) => {
  const hours = Math.floor(minute / 60);
  const mins = minute % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};
