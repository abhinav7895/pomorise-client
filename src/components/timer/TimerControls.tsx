import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, RefreshCw, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimerMode } from '@/context/TimerContext';
import clickSoundFile from '/audio/button-click.mp3';

interface TimerControlsProps {
  timerState: 'idle' | 'running' | 'paused' | 'finished';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  timerMode: TimerMode;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
  onSkip,
  timerMode,
}) => {
  const clickSoundRef = useRef(new Audio(clickSoundFile));

  const getThemeStyles = () => {
    switch (timerMode) {
      case 'focus':
        return {
          primary: 'bg-timer-focus/20 hover:bg-timer-focus/40 border-timer-focus text-white ',
          secondary: 'border-timer-focus text-timer-focus hover:bg-timer-focus/10',
        };
      case 'shortBreak':
        return {
          primary: 'bg-timer-short-break/20 hover:bg-timer-short-breaks/40 border-timer-short-break text-white',
          secondary: 'border-timer-short-break text-timer-short-break hover:bg-timer-short-break/10',
        };
      case 'longBreak':
        return {
          primary: 'bg-timer-long-break/20 hover:bg-timer-long-break/40 border-timer-long-break text-white',
          secondary: 'border-timer-long-break text-timer-long-break hover:bg-timer-long-break/10',
        };
      default:
        return {
          primary: 'bg-timer-focus hover:bg-timer-focus/90 text-white',
          secondary: 'border-timer-focus text-timer-focus hover:bg-timer-focus/10',
        };
    }
  };

  const themeStyles = getThemeStyles();

  const handleStartClick = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(error => console.error("Error playing sound:", error));
    }
    onStart();
  };
  const handlePauseClick = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(error => console.error("Error playing sound:", error));
    }
    onPause();
  };

  return (
    <div className="flex items-center gap-4">
      {timerState === 'running' ? (
        <Button
          onClick={handlePauseClick}
          variant="outline"
          className={cn(
            "button-hover-effect button-active-effect p-3 h-auto border-dashed shadow-lg transition-all duration-300",
            themeStyles.primary
          )}
          aria-label="Pause Timer"
        >
          <PauseCircle className="mr-2 h-5 w-5" />
          Pause
        </Button>
      ) : (
        <Button
          onClick={handleStartClick} 
          variant="outline"
          className={cn(
            "button-hover-effect button-active-effect p-3 border-dashed h-auto shadow-lg transition-all duration-300",
            themeStyles.primary
          )}
          aria-label="Start Timer"
        >
          <PlayCircle className="mr-2 h-5 w-5" />
          {timerState === 'paused' ? 'Resume' : 'Start'}
        </Button>
      )}

      <Button
        onClick={onReset}
        variant="outline"
        className={cn(
          "border-dashed p-3 h-auto transition-all duration-300",
          themeStyles.secondary
        )}
        aria-label="Reset Timer"
      >
        <RefreshCw className="h-5 w-5" />
      </Button>

      <Button
        onClick={onSkip}
        variant="outline"
        className={cn(
          "border-dashed p-3 h-auto transition-all duration-300",
          themeStyles.secondary
        )}
        aria-label="Skip Timer"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default TimerControls;