import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';

export interface Habit {
  id: string;
  name: string;
  description: string;
  isPositive: boolean;
  targetDays: number;
  currentStreak: number;
  longestStreak: number;
  completedDates: string[];
  lastCompletedDate: string | null;
  reminderTime: string | null;
  stackedWith: string | null;
  created: string;
  color: string;
}

const defaultHabits: Habit[] = [];

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'completedDates' | 'lastCompletedDate' | 'created'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  removeHabit: (id: string) => void;
  completeHabitForToday: (id: string) => void;
  resetHabitStreak: (id: string) => void;
  getHabitById: (id: string) => Habit | undefined;
  getHabitsToStack: () => Habit[];
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const storedHabits = localStorage.getItem('habits');
      return storedHabits ? JSON.parse(storedHabits) : defaultHabits;
    } catch (error) {
      console.error('Error loading habits from localStorage:', error);
      return defaultHabits;
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits to localStorage:', error);
    }
  }, [habits]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const timeString = now.toTimeString().substring(0, 5);
      
      habits.forEach(habit => {
        if (habit.reminderTime === timeString) {
          const today = new Date().toISOString().split('T')[0];
          
          if (!habit.completedDates.includes(today)) {
            toast({
              title: `Habit Reminder: ${habit.name}`,
              description: `Don't forget to ${habit.isPositive ? 'complete' : 'avoid'} this habit today!`,
              duration: 5000,
            });
          }
        }
      });
    };
    
    const intervalId = setInterval(checkReminders, 60000);
    return () => clearInterval(intervalId);
  }, [habits, toast]);

  const addHabit = (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'completedDates' | 'lastCompletedDate' | 'created'>) => {
    const newHabit: Habit = {
      ...habit,
      id: uuidv4(),
      currentStreak: 0,
      longestStreak: 0,
      completedDates: [],
      lastCompletedDate: null,
      created: new Date().toISOString(),
    };
    
    setHabits(prevHabits => [...prevHabits, newHabit]);
    
    toast({
      title: 'Habit Created',
      description: `Your habit "${habit.name}" has been created. Start tracking today!`,
    });
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id ? { ...habit, ...updates } : habit
      )
    );
  };

  const removeHabit = (id: string) => {
    const habitToRemove = habits.find(h => h.id === id);
    if (!habitToRemove) return;
    
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
    
    toast({
      title: 'Habit Removed',
      description: `"${habitToRemove.name}" has been removed from your habits.`,
    });
  };

  const completeHabitForToday = (id: string) => {
    setHabits(prevHabits => {
      return prevHabits.map(habit => {
        if (habit.id !== id) return habit;
        
        const today = new Date().toISOString().split('T')[0];
        
        if (habit.completedDates.includes(today)) return habit;
        
        const updatedDates = [...habit.completedDates, today];
        let currentStreak = habit.currentStreak;
        
        if (habit.lastCompletedDate) {
          const lastDate = new Date(habit.lastCompletedDate);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
            currentStreak += 1;
          } else if (lastDate.toISOString().split('T')[0] !== today) {
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }
        
        const longestStreak = Math.max(currentStreak, habit.longestStreak);
        
        if (currentStreak === habit.targetDays) {
          toast({
            title: '🎉 Congratulations!',
            description: `You've reached your target of ${habit.targetDays} days for "${habit.name}"!`,
            duration: 6000,
          });
        }
        
        const milestones = [7, 14, 21, 30, 60, 90, 180, 365];
        if (milestones.includes(currentStreak) && currentStreak !== habit.currentStreak) {
          toast({
            title: '🏆 Milestone Achieved!',
            description: `You've maintained "${habit.name}" for ${currentStreak} days. Keep going!`,
            duration: 6000,
          });
        }
        
        return {
          ...habit,
          completedDates: updatedDates,
          lastCompletedDate: today,
          currentStreak,
          longestStreak,
        };
      });
    });
  };

  const resetHabitStreak = (id: string) => {
    setHabits(prevHabits => {
      return prevHabits.map(habit => {
        if (habit.id !== id) return habit;
        
        return {
          ...habit,
          currentStreak: 0,
          lastCompletedDate: null,
        };
      });
    });
    
    toast({
      title: 'Streak Reset',
      description: `The streak for this habit has been reset. Start again today!`,
    });
  };

  const getHabitById = (id: string) => {
    return habits.find(habit => habit.id === id);
  };

  const getHabitsToStack = () => {
    return habits.filter(habit => habit.currentStreak >= 3);
  };

  return (
    <HabitContext.Provider value={{
      habits,
      addHabit,
      updateHabit,
      removeHabit,
      completeHabitForToday,
      resetHabitStreak,
      getHabitById,
      getHabitsToStack,
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
