
import React, { useState } from 'react';
import { useHabits } from '@/context/HabitContext';
import HabitItem from './HabitItem';
import AddHabit from './AddHabit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, CheckCircle, Flame, Target, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const HabitList: React.FC = () => {
  const { habits } = useHabits();
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  
  const positiveHabits = habits.filter(habit => habit.isPositive);
  const negativeHabits = habits.filter(habit => !habit.isPositive);
  
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(new Date().toISOString().split('T')[0])
  ).length;
  
  const longestStreak = habits.reduce((max, habit) => 
    Math.max(max, habit.longestStreak), 0
  );
  
  const totalActive = habits.length;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <motion.div 
      className=" sm:p-6 sm:shadow-lg  sm:backdrop-blur-sm border-dashed sm:border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold tracking-tight">Habits</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20 dark:bg-secondary/10">
            <div className="p-1.5 rounded-full bg-secondary/30">
              <Target className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div>
              <div className="font-medium">{totalActive}</div>
              <div className="text-xs text-muted-foreground">Active Habits</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 dark:bg-primary/5">
            <div className="p-1.5 rounded-full bg-primary/20">
              <Flame className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{longestStreak}</div>
              <div className="text-xs text-muted-foreground">Longest Streak</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 dark:bg-green-500/5">
            <div className="p-1.5 rounded-full bg-green-500/20">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <div className="font-medium">{completedToday}</div>
              <div className="text-xs text-muted-foreground">Completed Today</div>
            </div>
          </div>
        </div>
      </header>

      {isAddingHabit ? (
        <AddHabit 
          onCancel={() => setIsAddingHabit(false)} 
          onHabitAdded={() => setIsAddingHabit(false)} 
        />
      ) : (
        <>
          <Tabs defaultValue="build" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="build" className="font-medium flex items-center justify-center gap-1">
                <ArrowUpCircle className="h-4 w-4" />
                Build ({positiveHabits.length})
              </TabsTrigger>
              <TabsTrigger value="break" className="font-medium flex items-center justify-center gap-1">
                <ArrowDownCircle className="h-4 w-4" />
                Break ({negativeHabits.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="build" className="focus-visible:outline-none focus-visible:ring-0">
              <ScrollArea className="h-[320px] pr-4 -mr-4">
                {positiveHabits.length > 0 ? (
                  <motion.div 
                    className="space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {positiveHabits.map((habit) => (
                      <HabitItem key={habit.id} habit={habit} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="text-center py-10 text-muted-foreground flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="p-4 rounded-full bg-primary/10 mb-3">
                      <ArrowUpCircle className="w-6 h-6 text-primary/70" />
                    </div>
                    <p className="font-medium">No habits to build yet</p>
                    <p className="text-sm mt-1">Start building a positive habit today</p>
                  </motion.div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="break" className="focus-visible:outline-none focus-visible:ring-0">
              <ScrollArea className="h-[320px] pr-4 -mr-4">
                {negativeHabits.length > 0 ? (
                  <motion.div 
                    className="space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {negativeHabits.map((habit) => (
                      <HabitItem key={habit.id} habit={habit} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="text-center py-10 text-muted-foreground flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="p-4 rounded-full bg-rose-500/10 mb-3">
                      <ArrowDownCircle className="w-6 h-6 text-rose-500/70" />
                    </div>
                    <p className="font-medium">No habits to break yet</p>
                    <p className="text-sm mt-1">Start breaking a negative habit today</p>
                  </motion.div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              onClick={() => setIsAddingHabit(true)}
              className="w-full mt-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm transition-all group flex items-center justify-center"
              size="lg"
            >
              <PlusCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Add Habit
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default HabitList;
