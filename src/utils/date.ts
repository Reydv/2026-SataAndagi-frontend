// src/utils/date.ts

export const getLocalISOString = () => {
  const now = new Date();
  // Adjust for timezone offset to get "Local" ISO string
  const offset = now.getTimezoneOffset() * 60000;
  const localTime = new Date(now.getTime() - offset);
  return localTime.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
};