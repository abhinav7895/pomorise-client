
import { addDays, isToday, format, isSameDay, differenceInDays } from "date-fns";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  completedDates: string[]; // ISO date strings
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  completedDates: [],
};

export const loadStreakData = (): StreakData => {
  try {
    const storedData = localStorage.getItem('pomodoroStreak');
    return storedData ? JSON.parse(storedData) : { ...defaultStreakData };
  } catch (error) {
    console.error('Error loading streak data:', error);
    return { ...defaultStreakData };
  }
};

export const saveStreakData = (data: StreakData): void => {
  try {
    localStorage.setItem('pomodoroStreak', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving streak data:', error);
  }
};

export const recordCompletedPomodoro = (): StreakData => {
  const streakData = loadStreakData();
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (streakData.completedDates.includes(todayStr)) {
    return streakData;
  }
  
  const updatedDates = [...streakData.completedDates, todayStr];
  
  let currentStreak = streakData.currentStreak;
  
  if (streakData.lastCompletedDate) {
    const lastDate = new Date(streakData.lastCompletedDate);
    const yesterday = addDays(new Date(), -1);
    
    if (isSameDay(lastDate, yesterday)) {
      currentStreak += 1;
    } else if (!isSameDay(lastDate, new Date())) {
      currentStreak = 1;
    }
  } else {
    currentStreak = 1;
  }
  
  const updatedData: StreakData = {
    currentStreak,
    longestStreak: Math.max(currentStreak, streakData.longestStreak),
    lastCompletedDate: todayStr,
    completedDates: updatedDates,
  };
  
  saveStreakData(updatedData);
  return updatedData;
};

export const checkForMilestone = (streakData: StreakData): number | null => {
  const milestones = [3, 7, 14, 21, 30, 60, 90, 100];
  
  if (milestones.includes(streakData.currentStreak)) {
    return streakData.currentStreak;
  }
  
  return null;
};

export const getCalendarData = (streakData: StreakData) => {
  const today = new Date();
  const completedDates = streakData.completedDates.map(date => new Date(date));
  
  return {
    completedDates,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    lastCompletedDate: streakData.lastCompletedDate ? new Date(streakData.lastCompletedDate) : null
  };
};
