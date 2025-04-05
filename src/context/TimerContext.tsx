import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { recordCompletedPomodoro } from '@/utils/streakTracker';
import { getFocusMusicPlayer } from '@/utils/focusMusic';
import { sendNotification } from '@/utils/notifications';
import { useTasks } from './TaskContext'; 

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  alarmEnabled: boolean;
  selectedAlarm: string;
}

interface StoredTimerState {
  timerState: 'idle' | 'running' | 'paused' | 'finished';
  timerMode: TimerMode;
  timeRemaining: number;
  pomodoroCount: number;
  startTime: number | null;
  pausedTimeRemaining: number | null;
  lastUpdated: number;
}

interface TimerContextType {
  timerState: 'idle' | 'running' | 'paused' | 'finished';
  timerMode: TimerMode;
  settings: TimerSettings;
  timeRemaining: number;
  pomodoroCount: number;
  pomodorosCompleted: number; 
  progress: number;
  isTimerActive: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  updateSettings: (newSettings: Partial<TimerSettings>) => void;
  setTimerMode: (mode: TimerMode) => void;
  startFocusTimerFromBeginning: () => void; 
}

const defaultSettings: TimerSettings = {
  focusDuration: 25 * 60, 
  shortBreakDuration: 5 * 60, 
  longBreakDuration: 15 * 60,
  longBreakInterval: 4, 
  autoStartBreaks: true,
  autoStartPomodoros: true,
  alarmEnabled: true, 
  selectedAlarm: 'Alarm Bell.mp3',
};

const getDurationByMode = (mode: TimerMode, settingsObj: TimerSettings) => {
  switch (mode) {
    case 'focus':
      return settingsObj.focusDuration;
    case 'shortBreak':
      return settingsObj.shortBreakDuration;
    case 'longBreak':
      return settingsObj.longBreakDuration;
    default:
      return settingsObj.focusDuration;
  }
};

function calculateProgress(mode: TimerMode, settings: TimerSettings, timeRemaining: number): number {
  const totalDuration = getDurationByMode(mode, settings);
  const elapsed = totalDuration - timeRemaining;
  return Math.min(Math.max(elapsed / totalDuration, 0), 1) * 100;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProviderWithTasks: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const taskContext = useTasks();
  
  return (
    <TimerProviderInternal taskContext={taskContext}>
      {children}
    </TimerProviderInternal>
  );
};

const TimerProviderInternal: React.FC<{ 
  children: React.ReactNode;
  taskContext: ReturnType<typeof useTasks>;
}> = ({ children, taskContext }) => {
  const { activeTaskId, incrementCompletedPomodoros, updateTask, getActiveTask } = taskContext;

  const [settings, setSettings] = useState<TimerSettings>(() => {
    const savedSettings = localStorage.getItem('timerSettings');
    let initialSettings: TimerSettings;

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        initialSettings = {
          ...defaultSettings,
          ...parsedSettings,
          alarmEnabled:
            parsedSettings.alarmEnabled !== undefined
              ? parsedSettings.alarmEnabled
              : defaultSettings.alarmEnabled,
          selectedAlarm:
            parsedSettings.selectedAlarm !== undefined
              ? parsedSettings.selectedAlarm
              : defaultSettings.selectedAlarm,
        };
      } catch (error) {
        console.error('Error parsing saved settings:', error);
        initialSettings = defaultSettings;
      }
    } else {
      initialSettings = defaultSettings;
    }

    localStorage.setItem('timerSettings', JSON.stringify(initialSettings));
    return initialSettings;
  });
  
  const [timerState, setTimerState] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle');
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timeRemaining, setTimeRemaining] = useState<number>(settings.focusDuration);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTimeRemaining, setPausedTimeRemaining] = useState<number | null>(null);

  const progress = calculateProgress(timerMode, settings, timeRemaining);

  useEffect(() => {
    const storedState = localStorage.getItem('timerState');
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState) as StoredTimerState;
        const now = Date.now();
        const elapsed = Math.floor((now - parsedState.lastUpdated) / 1000);
        
        if (now - parsedState.lastUpdated < 6 * 60 * 60 * 1000) {
          setTimerMode(parsedState.timerMode);
          setPomodoroCount(parsedState.pomodoroCount);
          
          if (parsedState.timerState === 'running' && parsedState.startTime) {
            const newTimeRemaining = parsedState.pausedTimeRemaining !== null
              ? Math.max(0, parsedState.pausedTimeRemaining - elapsed)
              : Math.max(0, parsedState.timeRemaining - elapsed);
            
            if (newTimeRemaining <= 0) {
              setTimerState('finished');
              setTimeRemaining(0);
            } else {
              setTimerState('running');
              setTimeRemaining(newTimeRemaining);
              setStartTime(now);
              setPausedTimeRemaining(newTimeRemaining);
            }
          } else {
            setTimerState(parsedState.timerState);
            setTimeRemaining(parsedState.timeRemaining);
            setPausedTimeRemaining(parsedState.pausedTimeRemaining);
          }
        }
      } catch (error) {
        console.error('Error restoring timer state:', error);
      }
    }
  }, []);

  useEffect(() => {
    const stateToStore: StoredTimerState = {
      timerState,
      timerMode,
      timeRemaining,
      pomodoroCount,
      startTime,
      pausedTimeRemaining,
      lastUpdated: Date.now(),
    };
    localStorage.setItem('timerState', JSON.stringify(stateToStore));
  }, [timerState, timerMode, timeRemaining, pomodoroCount, startTime, pausedTimeRemaining]);

  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    resetTimerWithMode(timerMode);
  }, [timerMode]);

  useEffect(() => {
    if (timerState === 'running' && startTime) {
      const id = window.setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const newTimeRemaining = pausedTimeRemaining !== null 
          ? pausedTimeRemaining - elapsedTime
          : getCurrentModeDuration() - elapsedTime;
          
        if (newTimeRemaining <= 0) {
          completeTimer();
        } else {
          setTimeRemaining(newTimeRemaining);
        }
      }, 500);
      
      setTimerId(id);
      return () => clearInterval(id);
    }
  }, [timerState, startTime, pausedTimeRemaining, settings]); 

  useEffect(() => {
    const formattedTime = formatTime(timeRemaining);
    const modePrefix = 
      timerMode === 'focus' ? '🧠 Focus' : 
      timerMode === 'shortBreak' ? '☕ Break' : 
      '🌿 Long Break';
    
    document.title = `${formattedTime} - ${modePrefix}`;
    
    return () => {
      document.title = 'Pomodoro Timer';
    };
  }, [timeRemaining, timerMode]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completeTimer = () => {
    clearInterval(timerId as number);
    setTimerId(null);
    setTimeRemaining(0);
    setTimerState('finished');
    
    const musicPlayer = getFocusMusicPlayer();
    if (musicPlayer.getIsPlaying()) {
      musicPlayer.fadeOut();
    }

    if (settings.alarmEnabled) {
      const alarm = new Audio(`/audio/${settings.selectedAlarm}`);
      alarm.play().catch((error) => {
        console.error('Error playing alarm:', error);
      });
    }
    
    showNotification();
    
    if (timerMode === 'focus') {
      recordCompletedPomodoro();
      
      if (activeTaskId) {
        incrementCompletedPomodoros(activeTaskId);
        
        const activeTask = getActiveTask();
        if (activeTask && activeTask.completedPomodoros + 1 >= activeTask.estimatedPomodoros) {
          updateTask(activeTaskId, { 
            isCompleted: true,
            completedPomodoros: activeTask.completedPomodoros + 1
          });
          
          toast("Task completed!", {
            description: `"${activeTask.title}" has been marked as completed.`,
          });
        }
      }
      
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      const isLongBreak = newCount % settings.longBreakInterval === 0;
      const nextMode = isLongBreak ? 'longBreak' : 'shortBreak';
      
      if (settings.autoStartBreaks) {
        setTimeout(() => {
          setTimerMode(nextMode);
          setTimerState('running');
          setStartTime(Date.now());
          setPausedTimeRemaining(null);
        }, 1500); 
      } else {
        setTimerMode(nextMode);
      }
    } else {
      if (settings.autoStartPomodoros) {
        setTimeout(() => {
          setTimerMode('focus');
          setTimerState('running');
          setStartTime(Date.now());
          setPausedTimeRemaining(null);
        }, 1500); 
      } else {
        setTimerMode('focus');
      }
    }
  };

  const showNotification = () => {
    const title = timerMode === 'focus' 
      ? 'Focus time completed!' 
      : timerMode === 'shortBreak'
        ? 'Short break completed!'
        : 'Long break completed!';
    
    const message = timerMode === 'focus'
      ? 'Time for a break!'
      : 'Ready to focus again?';
    
    toast(title, {
      description: message,
    });
    
    sendNotification(title, { body: message });
  };

  const startTimer = () => {
    setTimerState('running');
    setStartTime(Date.now());
    setPausedTimeRemaining(timeRemaining < getCurrentModeDuration() ? timeRemaining : null);
  };

  const pauseTimer = () => {
    if (timerState === 'running') {
      setTimerState('paused');
      clearInterval(timerId as number);
      setTimerId(null);
      setPausedTimeRemaining(timeRemaining);
    }
  };

  const resetTimer = () => {
    clearInterval(timerId as number);
    setTimerId(null);
    resetTimerWithMode(timerMode);
  };

  const skipTimer = () => {
    clearInterval(timerId as number);
    setTimerId(null);
    
    if (timerMode === 'focus') {
      const isLongBreak = (pomodoroCount + 1) % settings.longBreakInterval === 0;
      setTimerMode(isLongBreak ? 'longBreak' : 'shortBreak');
      setPomodoroCount(pomodoroCount + 1);
    } else {
      setTimerMode('focus');
    }
  };

  const resetTimerWithMode = (mode: TimerMode) => {
    clearInterval(timerId as number);
    setTimerId(null);
    setTimeRemaining(getDurationByMode(mode, settings));
    setTimerState('idle');
    setStartTime(null);
    setPausedTimeRemaining(null);
  };

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    if (timerState === 'idle') {
      setTimeRemaining(getDurationByMode(timerMode, updatedSettings));
    }
  };

  const getCurrentModeDuration = () => {
    return getDurationByMode(timerMode, settings);
  };

  const startFocusTimerFromBeginning = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    
    setTimeout(() => {
      setTimerMode('focus');
      setTimeRemaining(settings.focusDuration);
      setStartTime(Date.now());
      setPausedTimeRemaining(null);
      setTimerState('running');
    }, 0);
  };

  return (
    <TimerContext.Provider
      value={{
        timerState,
        timerMode,
        settings,
        timeRemaining,
        pomodoroCount,
        pomodorosCompleted: pomodoroCount, 
        progress,
        isTimerActive: timerState === 'running',
        startTimer,
        pauseTimer,
        resetTimer,
        skipTimer,
        updateSettings,
        setTimerMode,
        startFocusTimerFromBeginning
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};