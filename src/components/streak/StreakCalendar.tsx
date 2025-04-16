
import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar as CalendarIcon, Flame, Award, Check, ChevronRight, ChevronLeft, Zap, Target, TrendingUp } from 'lucide-react';
import { loadStreakData, getCalendarData } from '@/utils/streakTracker';
import { motion } from 'framer-motion';
import { format, subMonths, addMonths, startOfMonth } from 'date-fns';

const StreakCalendar = () => {
  const [streakData, setStreakData] = useState(loadStreakData());
  const [celebratedMilestone, setCelebratedMilestone] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeView, setActiveView] = useState<'calendar' | 'stats'>('calendar');
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  const calendarData = getCalendarData(streakData);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const completionRate = calendarData.completedDates.length > 0 
    ? Math.round((calendarData.completedDates.length / 30) * 100) 
    : 0;
  
  const daysSinceStart = calendarData.completedDates.length > 0 
    ? Math.round((new Date().getTime() - calendarData.completedDates[0].getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;
  
  useEffect(() => {
    const milestones = [3, 7, 14, 21, 30, 60, 90, 100];
    

    if (milestones.includes(streakData.currentStreak) && 
        streakData.currentStreak !== celebratedMilestone) {
      setCelebratedMilestone(streakData.currentStreak);
    }
  }, [streakData, celebratedMilestone]);
  
  const getNextMilestone = () => {
    const milestones = [3, 7, 14, 21, 30, 60, 90, 100, 180, 365];
    return milestones.find(milestone => milestone > streakData.currentStreak) || (streakData.currentStreak + 10);
  };
  
  const nextMilestone = getNextMilestone();
  const milestoneProgress = (streakData.currentStreak / nextMilestone) * 100;
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };
  
  const getCompletedDatesForMonth = () => {
    const start = startOfMonth(currentMonth);
    return calendarData.completedDates.filter(date => 
      date.getMonth() === start.getMonth() && date.getFullYear() === start.getFullYear()
    );
  };
  
  const consecutiveDays = getCompletedDatesForMonth().length;
  
  return (
    <Card className="shadow-md border-t-4 border-t-primary">
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span>Focus Tracker</span>
          </CardTitle>
          <div className="flex gap-2">
            <Badge 
              variant={activeView === 'calendar' ? 'default' : 'outline'} 
              className="cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => setActiveView('calendar')}
            >
              Calendar
            </Badge>
            <Badge 
              variant={activeView === 'stats' ? 'default' : 'outline'} 
              className="cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => setActiveView('stats')}
            >
              Stats
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">

        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div 
            className="col-span-1 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xs font-medium text-muted-foreground mb-1">Current Streak</h3>
            <div className="flex items-center justify-center mb-1 text-primary">
              <Flame className="h-5 w-5" />
            </div>
            <span className="text-3xl font-bold">{streakData.currentStreak}</span>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Days in a row
            </p>
          </motion.div>
          
          <motion.div 
            className="col-span-1 bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex flex-col items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xs font-medium text-muted-foreground mb-1">Longest Streak</h3>
            <div className="flex items-center justify-center mb-1 text-amber-500">
              <Trophy className="h-5 w-5" />
            </div>
            <span className="text-3xl font-bold">{streakData.longestStreak}</span>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Your record
            </p>
          </motion.div>
          
          <motion.div 
            className="col-span-1 bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-xl p-4 flex flex-col items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xs font-medium text-muted-foreground mb-1">Completion Rate</h3>
            <div className="flex items-center justify-center mb-1 text-green-500">
              <Check className="h-5 w-5" />
            </div>
            <span className="text-3xl font-bold">{completionRate}%</span>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Last 30 days
            </p>
          </motion.div>
        </div>
        
        {celebratedMilestone  && (
          <motion.div 
            className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/20 to-amber-500/20 text-center shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <h3 className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {celebratedMilestone} Day Milestone Achieved!
              <Award className="h-5 w-5 text-primary" />
            </h3>
            <p>Incredible consistency! Keep up the great focus work.</p>
          </motion.div>
        )}
        
        {activeView === 'calendar' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <button 
                onClick={() => navigateMonth('prev')} 
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
              <button 
                onClick={() => navigateMonth('next')} 
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <Calendar
              mode="multiple"
              month={currentMonth}
              selected={calendarData.completedDates}
              className="rounded-md border"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-bold",
                day: "rounded-full h-9 w-9 p-0 hover:bg-accent transition-colors font-medium",
              }}
            />
            
            <div className="mt-4 text-sm text-center text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full bg-primary mr-1"></span>
              Completed Focus Sessions 
              <span className="ml-3 inline-block w-3 h-3 rounded-full bg-accent mr-1"></span>
              Today
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Progress to next milestone ({nextMilestone} days)</h3>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  style={{ width: `${milestoneProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${milestoneProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {streakData.currentStreak} of {nextMilestone} days ({Math.round(milestoneProgress)}%)
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{daysSinceStart}</div>
                <div className="text-xs text-muted-foreground">Days since start</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="h-4 w-4 text-rose-500" />
                </div>
                <div className="text-2xl font-bold">{calendarData.completedDates.length}</div>
                <div className="text-xs text-muted-foreground">Total focus days</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold">{consecutiveDays}</div>
                <div className="text-xs text-muted-foreground">Days this month</div>
              </Card>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Upcoming Milestones
              </h3>
              <div className="space-y-2">
                {[7, 14, 30, 60, 90].filter(m => m > streakData.currentStreak).slice(0, 3).map(milestone => (
                  <div key={milestone} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{milestone} days</Badge>
                      {milestone <= 14 ? 
                        "Focus habit forming" : 
                        milestone <= 30 ? 
                          "Consistent performer" : 
                          "Focus master"
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {milestone - streakData.currentStreak} days left
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;
