import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useTimer } from '@/context/TimerContext';
import { useTasks } from '@/context/TaskContext';
import { useHabits } from '@/context/HabitContext';
import { useJournals } from '@/context/JournalContext';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Download, Share2, Edit2 } from 'lucide-react';

interface ShareCardProps {
  onClose?: () => void;
}

export const ShareProgressCard: React.FC<ShareCardProps> = ({ onClose }) => {
  const { pomodoroCount } = useTimer();
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const { journals } = useJournals();
  const [customMessage, setCustomMessage] = useState('');
  const [includeStats, setIncludeStats] = useState(true);
  const [editing, setEditing] = useState(false);
  const [userName, setUserName] = useState('My');
  const [cardTitle, setCardTitle] = useState('Productivity Progress');

  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const activeHabits = habits.filter(habit => habit.currentStreak > 0).length;
  const journalEntries = journals.length;

  const downloadCard = async () => {
    const cardElement = document.getElementById('progress-card');
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `${userName}-progress-card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating card:', error);
    }
  };

  const shareCard = async () => {
    const cardElement = document.getElementById('progress-card');
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const blob = await new Promise<Blob>(resolve => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      const file = new File([blob], 'progress-card.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${userName}'s Productivity Progress`,
          text: customMessage || 'Check out my productivity progress!',
          files: [file],
        });
      } else {
        downloadCard();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      downloadCard();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Share Your Progress</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-1"
        >
          <Edit2 size={16} />
          {editing ? 'Preview' : 'Edit'}
        </Button>
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Card Title</Label>
            <Input 
              value={cardTitle} 
              onChange={(e) => setCardTitle(e.target.value)} 
              placeholder="Enter card title"
            />
          </div>
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label>Custom Message</Label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal message..."
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="include-stats">Include Statistics</Label>
            <Switch
              id="include-stats"
              checked={includeStats}
              onCheckedChange={setIncludeStats}
            />
          </div>
        </div>
      ) : (
        <motion.div 
          id="progress-card"
          className="relative p-6 border border-dashed bg-neutral-950 border-neutral-800 shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-[url('/images/card-pattern.svg')] bg-cover opacity-10" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-center mb-2 text-[#5c99d6]">
              {cardTitle}
            </h3>
            <p className="text-center text-sm text-neutral-400 mb-6">
              {userName}'s productivity journey
            </p>
            
            {customMessage && (
              <div className="bg-neutral-800/50 rounded-lg p-4 mb-6 border border-neutral-700">
                <p className="text-neutral-300 italic text-center">{customMessage}</p>
              </div>
            )}

            {includeStats && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-900/50 p-4 text-center border border-dashed border-neutral-700">
                  <p className="text-3xl font-bold text-primary">{pomodoroCount}</p>
                  <p className="text-xs text-neutral-400">Pomodoros</p>
                </div>
                <div className="bg-neutral-900/50 p-4 text-center border border-dashed border-neutral-700">
                  <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
                  <p className="text-xs text-neutral-400">Tasks Completed</p>
                </div>
                <div className="bg-neutral-900/50 p-4 text-center border border-dashed border-neutral-700">
                  <p className="text-3xl font-bold text-blue-500">{activeHabits}</p>
                  <p className="text-xs text-neutral-400">Active Habits</p>
                </div>
                <div className="bg-neutral-900/50 p-4 text-center border border-dashed border-neutral-700">
                  <p className="text-3xl font-bold text-purple-500">{journalEntries}</p>
                  <p className="text-xs text-neutral-400">Journal Entries</p>
                </div>
              </div>
            )}

            <div className='w-full flex flex-col gap-3 items-center  justify-center'>
            <img src="/logo.svg" alt="" className='size-[50px]' />
            <div className="text-center text-xs text-neutral-500">
              Shared via Pomorise - Boost your productivity
            </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3 pt-2">
        <Button 
          variant="outline" 
          className="flex-1 gap-2" 
          onClick={downloadCard}
        >
          <Download size={16} />
          Download
        </Button>
        <Button 
          className="flex-1 gap-2" 
          onClick={shareCard}
        >
          <Share2 size={16} />
          Share
        </Button>
      </div>
    </div>
  );
};