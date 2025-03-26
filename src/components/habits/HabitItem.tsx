
import React, { useState } from 'react';
import { useHabits, Habit } from '@/context/HabitContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import { Flame, Check, MoreVertical, Calendar as CalendarIcon, Trash2, RotateCcw, LinkIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface HabitItemProps {
  habit: Habit;
}

const getColorClass = (color: string) => {
  switch (color) {
    case 'emerald': return 'bg-emerald-500';
    case 'blue': return 'bg-blue-500';
    case 'violet': return 'bg-violet-500';
    case 'amber': return 'bg-amber-500';
    case 'rose': return 'bg-rose-500';
    case 'cyan': return 'bg-cyan-500';
    default: return 'bg-primary';
  }
};

const getTextColorClass = (color: string) => {
  switch (color) {
    case 'emerald': return 'text-emerald-500';
    case 'blue': return 'text-blue-500';
    case 'violet': return 'text-violet-500';
    case 'amber': return 'text-amber-500';
    case 'rose': return 'text-rose-500';
    case 'cyan': return 'text-cyan-500';
    default: return 'text-primary';
  }
};

const HabitItem: React.FC<HabitItemProps> = ({ habit }) => {
  const { completeHabitForToday, resetHabitStreak, removeHabit, getHabitById } = useHabits();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const isCompletedToday = habit.completedDates.includes(new Date().toISOString().split('T')[0]);
  
  const progressPercentage = Math.min(100, Math.round((habit.currentStreak / habit.targetDays) * 100));
  const colorClass = getColorClass(habit.color);
  const textColorClass = getTextColorClass(habit.color);
  
  const handleComplete = () => {
    completeHabitForToday(habit.id);
  };
  
  const stackedWithHabit = habit.stackedWith ? getHabitById(habit.stackedWith) : null;
  
  const completedDatesArray = habit.completedDates.map(date => new Date(date));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-4 relative border-l-4 ${habit.isPositive ? '' : 'border-dashed'}`} style={{ borderLeftColor: habit.color }}>
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-2">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium line-clamp-1">{habit.name}</h3>
              {habit.isPositive ? (
                <Badge variant="outline" className={`border-dashed ${textColorClass} text-xs`}>
                  Build
                </Badge>
              ) : (
                <Badge variant="outline" className="border-dashed text-rose-500 text-xs">
                  Break
                </Badge>
              )}
            </div>
            
            {habit.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{habit.description}</p>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Flame className={`h-4 w-4 ${textColorClass}`} />
                  <span className="font-medium">{habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-xs text-muted-foreground">Target: {habit.targetDays} days</span>
              </div>
              
              <Progress value={progressPercentage} className="h-2" />
              
              <div className="flex flex-wrap gap-1.5 mt-1">
                {stackedWithHabit && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <LinkIcon className="inline h-3 w-3 mr-1" />
                    Stacked with: {stackedWithHabit.name}
                  </div>
                )}
                
                {habit.reminderTime && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="inline h-3 w-3 mr-1" />
                    Reminder: {habit.reminderTime}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={handleComplete}
              disabled={isCompletedToday}
              size="icon"
              variant={isCompletedToday ? "outline" : "default"}
              className={`rounded-full ${isCompletedToday ? 'bg-green-100 dark:bg-green-900/20 text-green-500' : ''}`}
            >
              <Check className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      View History
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Habit History: {habit.name}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                      <Calendar
                        mode="multiple"
                        selected={completedDatesArray}
                        className="rounded-md border"
                      />
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          Started: {formatDistanceToNow(new Date(habit.created), { addSuffix: true })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Current streak: {habit.currentStreak} days
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Longest streak: {habit.longestStreak} days
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total completions: {habit.completedDates.length} days
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <DropdownMenuItem onClick={() => resetHabitStreak(habit.id)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Streak
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => removeHabit(habit.id)} 
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Habit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default HabitItem;
