import React, { useState } from 'react';
import HabitList from '@/components/habits/HabitList';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import AddHabit from '@/components/habits/AddHabit';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SEO from '@/components/SEO';

const Habits = () => {
  const [showAddHabit, setShowAddHabit] = useState(false);

  const handleLearnMoreConfirm = () => {
    window.open('https://jamesclear.com/atomic-habits', '_blank');
  };

  return (
    <>
    <SEO
            title="Habit Tracker - Build Habits with Pomodoro"
            description="Track and build habits effectively using our Pomodoro app, inspired by Atomic Habits principles."
            keywords="habit tracker, atomic habits, habit building, pomodoro habits"
            canonicalUrl="https://pomorise.vercel.app/habits"
            ogImage='og-habit.png'
          />
      <motion.div 
        className=""
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className='hidden sm:block' asChild>
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Habit Builder</h1>
            </div>
            <div className="flex gap-2 px-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Learn More</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[425px] font-geist-mono">
                  <AlertDialogHeader>
                    <AlertDialogTitle>External Resource</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will redirect you to{' '}
                      <a 
                        href="https://jamesclear.com/atomic-habits"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:text-primary/80 transition-colors"
                      >
                        https://jamesclear.com/atomic-habits
                      </a>
                      {' '}to learn more about the principles behind Atomic Habits. Would you like to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLearnMoreConfirm}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setShowAddHabit(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Habit</span>
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">
            Build and break habits based on the principles of Atomic Habits.
            Focus on small changes to create remarkable results.
          </p>
        </header>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 gap-8">
          {showAddHabit ? (
            <AddHabit 
              onCancel={() => setShowAddHabit(false)}
              onHabitAdded={() => setShowAddHabit(false)}
            />
          ) : (
            <HabitList />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Habits;