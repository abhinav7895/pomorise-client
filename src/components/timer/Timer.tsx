import React, { useState, useEffect, useRef } from "react";
import { useTimer, TimerMode } from "@/context/TimerContext";
import { useTasks } from "@/context/TaskContext";
import CircularProgress from "@/components/ui/CircularProgress";
import TimerControls from "./TimerControls";
import MusicToggle from "./MusicToggle";
import { ChevronDown, ChevronUp, Clock, ListTodo, Settings2, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import TimerSettings from "./TimerSettings";
import { useToast } from "@/hooks/use-toast";

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
    settings,
  } = useTimer();

  const { toast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { getActiveTask, incrementCompletedPomodoros } = useTasks();
  const activeTask = getActiveTask();
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);

  const prevTimerStateRef = useRef(timerState);
  const prevTimerModeRef = useRef(timerMode);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (timerRef.current?.requestFullscreen) {
        timerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

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
      document.title = 'Pomorise - Pomodoro Timer - Boost Productivity with Task & Habit Tracking';
    };
  }, [timeRemaining, timerMode]);

  useEffect(() => {
    const prevTimerState = prevTimerStateRef.current;
    const prevTimerMode = prevTimerModeRef.current;

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
  }, [timerState, timerMode, activeTask, settings, toast]);

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
      ref={timerRef}
      className={cn(
        "flex flex-col max-w-3xl mx-auto select-none border-dashed w-full items-center p-8 glass-card transition-all duration-500 ease-in-out",
        getThemeClass(),
        "border",
        isFullScreen && "fixed inset-0 z-50 max-w-none w-screen h-screen bg-neutral-950 flex justify-center items-center p-0 border-none"
      )}
    >
      <div className={cn(
        "flex flex-col items-center w-full",
        isFullScreen && "max-w-md"
      )}>
        <div className={cn(
          "flex items-center justify-between w-full mb-6",
          isFullScreen && "px-4"
        )}>
          <div className="relative w-40">
            <button
              onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
              className={cn(
                "w-full py-2 px-4 flex items-center justify-between text-[var(--timer-text)] bg-[var(--timer-text)/10] backdrop-blur-sm border border-[var(--timer-text)/20] hover:bg-[var(--timer-text)/15] transition-colors border-dashed",
                isFullScreen && "bg-transparent text-neutral-200 border-neutral-800"
              )}
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
                  className={cn(
                    "absolute w-full mt-1 py-1  border border-dashed z-10",
                    isFullScreen && " bg-neutral-950 border-neutral-800"
                  )}
                >
                  <button
                    onClick={() => handleModeSelect('focus')}
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-secondary transition-colors",
                      timerMode === 'focus' && "font-medium text-timer-focus",
                      isFullScreen && "hover:bg-neutral-900 text-neutral-200"
                    )}
                  >
                    Focus
                  </button>
                  <button
                    onClick={() => handleModeSelect('shortBreak')}
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-secondary transition-colors",
                      timerMode === 'shortBreak' && "font-medium text-timer-short-break",
                      isFullScreen && "hover:bg-neutral-900 text-neutral-200"
                    )}
                  >
                    Short Break
                  </button>
                  <button
                    onClick={() => handleModeSelect('longBreak')}
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-secondary transition-colors",
                      timerMode === 'longBreak' && "font-medium text-timer-long-break",
                      isFullScreen && "hover:bg-neutral-900 text-neutral-200"
                    )}
                  >
                    Long Break
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullScreen}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                isFullScreen && "text-neutral-200 border border-neutral-800 hover:bg-transparent hover:text-white"
              )}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>

            {!isFullScreen && <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className={
                "text-muted-foreground hover:text-foreground transition-colors"}
            >
              <Settings2 className="w-4 h-4" />
            </Button>
            }
            <MusicToggle isFullScreen={isFullScreen}/>
          </div>
        </div>


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
            size={isFullScreen ? 320 : 280}
            strokeWidth={8}
            pathClassName={cn(getProgressColor(), pulseAnimation)}
          >
            <div className="flex flex-col items-center">
              <div className={cn(
                "text-6xl font-light text-[var(--timer-text)] timer-text mb-2",
                isFullScreen && "text-neutral-200"
              )}>
                {formatTime(timeRemaining)}
              </div>
              {activeTask ? (
                <div className={cn(
                  "text-sm text-muted-foreground flex items-center max-w-[200px]",
                  isFullScreen && "text-neutral-400"
                )}>
                  <ListTodo className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="font-medium truncate">{activeTask.title}</span>
                </div>
              ) : (
                <div className={cn(
                  "text-sm text-muted-foreground flex items-center opacity-60",
                  isFullScreen && "text-neutral-400"
                )}>
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
          isFullScreen={isFullScreen}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "mt-6 text-sm text-muted-foreground",
            isFullScreen && "text-neutral-400"
          )}
        >
          {pomodoroCount > 0 ? `${pomodoroCount} pomodoro${pomodoroCount !== 1 ? 's' : ''} completed today` : 'Start your first pomodoro!'}
        </motion.div>
      </div>

      {!isFullScreen && <TimerSettings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />}
    </motion.div>
  );
};

export default Timer;