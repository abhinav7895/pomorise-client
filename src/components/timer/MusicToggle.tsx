
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getFocusMusicPlayer } from '@/utils/focusMusic';
import { useTimer } from '@/context/TimerContext';
import { Music, MicOff, Volume2, SkipForward } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const MusicToggle = () => {
  const { timerState, timerMode } = useTimer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState('');
  const musicPlayer = getFocusMusicPlayer();
  
  const toggleMusic = () => {
    if (isPlaying) {
      musicPlayer.fadeOut();
      setIsPlaying(false);
    } else {
      musicPlayer.fadeIn();
      setIsPlaying(true);
      updateTrackInfo();
    }
  };
  
  const nextTrack = () => {
    musicPlayer.nextTrack();
    updateTrackInfo();
  };
  
  const updateTrackInfo = () => {
    const track = musicPlayer.getCurrentTrack();
    setCurrentTrackName(track.name);
  };
  
  useEffect(() => {
    if (timerState === 'finished' || (timerMode !== 'focus' && timerState === 'running')) {
      if (isPlaying) {
        musicPlayer.fadeOut();
        setIsPlaying(false);
      }
    }
  }, [timerState, timerMode, isPlaying]);
  
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleMusic}
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isPlaying ? <Volume2 size={18} /> : <Music size={18} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isPlaying ? 'Stop focus music' : 'Play focus music'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center"
          >
            <span className="text-xs text-muted-foreground mr-1">{currentTrackName}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={nextTrack}
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                  >
                    <SkipForward size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Next track
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicToggle;
