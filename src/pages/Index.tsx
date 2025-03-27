import React from 'react';
import Timer from '@/components/timer/Timer';
import TaskList from '@/components/tasks/TaskList';
import JournalList from '@/components/journal/JournalList'; 
import StreakCalendar from '@/components/streak/StreakCalendar';
import HabitWidget from '@/components/habits/HabitWidget';
import { motion } from 'framer-motion';
import { requestNotificationPermission } from '@/utils/notifications';
import { registerServiceWorker } from '@/utils/pwaUtils';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const Index = () => {
  React.useEffect(() => {
    requestNotificationPermission();
    registerServiceWorker();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  return (
    <>
      <SEO
        title="Pomodoro Timer - Boost Productivity with Task & Habit Tracking"
        description="Enhance your focus and productivity with our free Pomodoro timer app. Features task management, habit tracking, and performance insights."
        keywords="pomodoro timer, productivity app, task management, habit tracker, time management"
        canonicalUrl="https://pomorise.vercel.app/"
      />
      <motion.div 
        className="flex flex-col gap-6 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="w-full"
        >
          <Timer />
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="w-full"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-bold">All Tasks</h2>
          </div>
          <TaskList />
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="w-full"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-bold">All Journal</h2>
          </div>
          <JournalList /> 
        </motion.div>

        <div className="gap-6 w-full mb-6">
          <motion.div 
            variants={itemVariants}
          >
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
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants} 
          className="w-full"
        >
          <StreakCalendar />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Index;