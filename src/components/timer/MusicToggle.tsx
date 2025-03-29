import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getFocusMusicPlayer, musicTracks } from '@/utils/focusMusic';
import { useTimer } from '@/context/TimerContext';
import { Music, Pause, Play, SkipForward } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const MusicToggle = ({isFullScreen} : {isFullScreen : boolean}) => {
  const { timerState, timerMode } = useTimer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicPaused, setIsMusicPaused] = useState(() => {
    const savedState = localStorage.getItem('musicPaused');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [currentTrackName, setCurrentTrackName] = useState('');
  const musicPlayer = getFocusMusicPlayer();

  useEffect(() => {
    localStorage.setItem('musicPaused', JSON.stringify(isMusicPaused));
  }, [isMusicPaused]);

  const toggleMusic = () => {
    if (!isPlaying) {
      musicPlayer.fadeIn();
      setIsPlaying(true);
      setIsMusicPaused(false);
      updateTrackInfo();
    } else if (!isMusicPaused) {
      musicPlayer.pause();
      setIsMusicPaused(true);
    } else {
      musicPlayer.play();
      setIsMusicPaused(false);
    }
  };

  const stopMusic = () => {
    musicPlayer.fadeOut();
    setIsPlaying(false);
    setIsMusicPaused(true);
  };

  const nextTrack = () => {
    musicPlayer.nextTrack();
    updateTrackInfo();
    if (isPlaying && !isMusicPaused) {
      musicPlayer.play();
    }
  };

  const updateTrackInfo = () => {
    const track = musicPlayer.getCurrentTrack();
    setCurrentTrackName(track.name);
  };

  useEffect(() => {
    if (timerMode !== 'focus' || timerState === 'finished' || timerState === 'idle') {
      if (isPlaying) {
        stopMusic();
      }
    } else if (timerState === 'running' && !isMusicPaused && !isPlaying) {
      musicPlayer.fadeIn();
      setIsPlaying(true);
      updateTrackInfo();
    } else if (timerState === 'paused' && isPlaying && !isMusicPaused) {
      musicPlayer.pause();
      setIsMusicPaused(true);
    }
  }, [timerState, timerMode, isPlaying, isMusicPaused]);

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleMusic}
              size="sm"
              variant="ghost"
              className={
                cn("text-muted-foreground hover:text-foreground transition-colors",
                  isFullScreen && "text-neutral-200 border border-neutral-800 hover:bg-transparent hover:text-white"
                )
              }
              disabled={timerMode !== 'focus' || timerState === 'idle'}
            >
              {isPlaying ? (
                isMusicPaused ? <Play size={18} /> : <Pause size={18} />
              ) : (
                <Music size={18} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isPlaying ? (isMusicPaused ? 'Resume music' : 'Pause music') : 'Play focus music'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="hidden sm:flex items-center"
          >
            <span className="text-xs text-muted-foreground mr-1">{currentTrackName}</span>
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={nextTrack}
                    size="sm"
                    variant="ghost"
                    className={
                      cn("text-muted-foreground hover:text-foreground transition-colors",
                        isFullScreen && "text-neutral-200 border border-neutral-800 hover:bg-transparent hover:text-white"
                      )
                    }
                    disabled={isMusicPaused || timerState !== 'running'}
                  >
                    <SkipForward size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Next track
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicToggle;