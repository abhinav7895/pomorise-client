import { useEffect } from 'react';
import Timer from '@/components/timer/Timer';
import TaskList from '@/components/tasks/TaskList';
import JournalList from '@/components/journal/JournalList';
import StreakCalendar from '@/components/streak/StreakCalendar';
import HabitWidget from '@/components/habits/HabitWidget';

import { requestNotificationPermission } from '@/utils/notifications';
import { registerServiceWorker } from '@/utils/pwaUtils';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { useTimer } from '@/context/TimerContext';
import { cn } from '@/lib/utils';
import TimeBasedGreeting from '@/components/TimeBasedGreetings';

const Index = () => {
  const { timerMode } = useTimer();
  useEffect(() => {
    requestNotificationPermission();
    registerServiceWorker();
  }, []);

  const getThemeClass = () => {
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

  return (
    <>
      <SEO
        title="Pomorise - Pomodoro Timer - Boost Productivity with Task & Habit Tracking"
        description="Enhance your focus and productivity with our free Pomodoro timer app. Features task management, habit tracking, and performance insights."
        keywords="pomodoro timer, productivity app, task management, habit tracker, time management"
        canonicalUrl="https://pomorise.vercel.app/"
      />
      <div
        className={cn(
          "flex flex-col gap-6 mx-auto transition-colors duration-500",
          getThemeClass(),
          "bg-[var(--timer-bg)]"
        )}
      >
        <TimeBasedGreeting />
        
        <div className="w-full">
          <Timer />
        </div>

        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">All Tasks</h2>
          </div>
          <TaskList />
        </div>

        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">All Journal</h2>
          </div>
          <JournalList />
        </div>

        <div className="gap-6 w-full mb-6">
          <div>
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Habits</h2>
                <Button variant="outline" size="sm" asChild className="gap-2">
                  <Link to="/habits">
                    View All <ArrowRightCircle className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <HabitWidget />
            </div>
          </div>
        </div>

        <div className="w-full">
          <StreakCalendar />
        </div>
      </div>
    </>
  );
};

export default Index;