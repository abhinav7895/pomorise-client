import React, { useState, useEffect, useRef } from "react";
import { useTimer, TimerMode } from "@/context/TimerContext";
import { useTasks } from "@/context/TaskContext";
import CircularProgress from "@/components/ui/CircularProgress";
import TimerControls from "./TimerControls";
import MusicToggle from "./MusicToggle";
import { ChevronDown, ChevronUp, Clock, ListTodo, Settings, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import TimerSettings from "./TimerSettings";

const Timer: React.FC = () => {
  const {
    timerState,
    timerMode,
    timeRemaining,
    progress,
    isTimerActive,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setTimerMode,
    pomodoroCount,
  } = useTimer();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { getActiveTask, incrementCompletedPomodoros } = useTasks();
  const activeTask = getActiveTask();
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  
  const prevTimerStateRef = useRef(timerState);
  const prevTimerModeRef = useRef(timerMode);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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
  useEffect(() => {
    const prevTimerState = prevTimerStateRef.current;
    
    if (
      timerState === 'finished' && 
      prevTimerState !== 'finished' &&
      timerMode === 'focus' && 
      activeTask
    ) {
      incrementCompletedPomodoros(activeTask.id);
    }
    
    prevTimerStateRef.current = timerState;
    prevTimerModeRef.current = timerMode;
  }, [timerState, timerMode, activeTask]);

  const getThemeClass = (): string => {
    switch (timerMode) {
      case 'focus':
        return 'timer-focus-theme';
      case 'shortBreak':
        return 'timer-short-break-theme';
      case 'longBreak':
        return 'timer-long-break-theme';
      default:
        return 'timer-focus-theme';
    }
  };

  const getProgressColor = (): string => {
    switch (timerMode) {
      case 'focus':
        return 'text-timer-focus border-[var(--timer-text)/20]';
      case 'shortBreak':
        return 'text-timer-short-break border-[var(--timer-text)/20]';
      case 'longBreak':
        return 'text-timer-long-break';
      default:
        return 'text-timer-focus';
    }
  };

  const getModeDisplayName = (mode: TimerMode): string => {
    switch (mode) {
      case 'focus':
        return 'Focus';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus';
    }
  };

  const handleModeSelect = (mode: TimerMode) => {
    setTimerMode(mode);
    setIsModeMenuOpen(false);
  };

  const pulseAnimation = isTimerActive ? "animate-pulse-slow" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col max-w-3xl mx-auto select-none  border-dashed w-full items-center p-8 glass-card transition-all duration-500 ease-in-out",
        getThemeClass(),
        "border bg-[var(--timer-bg)]"
      )}
    >
      <div className="flex items-center justify-between w-full mb-6">
        <div className="relative w-40">
          <button
            onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
            className="w-full py-2 px-4 flex items-center justify-between text-[var(--timer-text)] bg-[var(--timer-text)/10] backdrop-blur-sm border border-[var(--timer-text)/20] hover:bg-[var(--timer-text)/15] transition-colors border-dashed"
          >
            <span>{getModeDisplayName(timerMode)}</span>
            {isModeMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {isModeMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute w-full mt-1 py-1 dark:bg-neutral-900/60  border border-dashed z-10"
              >
                <button
                  onClick={() => handleModeSelect('focus')}
                  className={cn(
                    "w-full text-left  px-4 py-2 hover:bg-secondary transition-colors",
                    timerMode === 'focus' && "font-medium text-timer-focus"
                  )}
                >
                  Focus
                </button>
                <button
                  onClick={() => handleModeSelect('shortBreak')}
                  className={cn(
                    "w-full text-left px-4 py-2 hover:bg-secondary transition-colors",
                    timerMode === 'shortBreak' && "font-medium text-timer-short-break"
                  )}
                >
                  Short Break
                </button>
                <button
                  onClick={() => handleModeSelect('longBreak')}
                  className={cn(
                    "w-full text-left px-4 py-2 hover:bg-secondary transition-colors",
                    timerMode === 'longBreak' && "font-medium text-timer-long-break"
                  )}
                >
                  Long Break
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings2 className="w-4 h-4" />
            
          </Button>

          <MusicToggle />
        </div>
      </div>

      {/* Timer display */}
      <motion.div
        className="mb-8"
        animate={{ scale: [1, 1.01, 1], opacity: isTimerActive ? [1, 0.9, 1] : 1 }}
        transition={{
          duration: 4,
          repeat: isTimerActive ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        <CircularProgress
          progress={progress}
          size={280}
          strokeWidth={8}
          pathClassName={cn(getProgressColor(), pulseAnimation)}
        >
          <div className="flex flex-col items-center">
        <div className="text-6xl font-light text-[var(--timer-text)] timer-text mb-2">
          {formatTime(timeRemaining)}
        </div>
        {activeTask ? (
          <div className="text-sm text-muted-foreground flex items-center max-w-[200px]">
            <ListTodo className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="font-medium truncate">{activeTask.title}</span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground flex items-center opacity-60">
            <Clock className="w-3 h-3 mr-1" />
            <span>No active task</span>
          </div>
        )}
          </div>
        </CircularProgress>
      </motion.div>

      {/* Timer controls */}
      <TimerControls
        timerState={timerState}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
        onSkip={skipTimer}
        timerMode={timerMode}
      />

      {/* Session counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-sm text-muted-foreground"
      >
        {pomodoroCount > 0 ? `${pomodoroCount} pomodoro${pomodoroCount !== 1 ? 's' : ''} completed today` : 'Start your first pomodoro!'}
      </motion.div>

      <TimerSettings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </motion.div>
  );
};

export default Timer;