
import React from 'react';
import { Link } from 'react-router-dom';
import { useHabits } from '@/context/HabitContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight, List, ArrowUpCircle, ArrowDownCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const HabitWidget = () => {
  const { habits, completeHabitForToday } = useHabits();
  
  const today = new Date().toISOString().split('T')[0];
  
  const pendingHabits = habits.filter(habit => 
    !habit.completedDates.includes(today)
  );
  
  const completedToday = habits.length - pendingHabits.length;
  
  const habitsCloseToTarget = habits.filter(habit => 
    (habit.currentStreak / habit.targetDays) >= 0.6 && 
    habit.currentStreak < habit.targetDays
  );
  
  return (
    <Card className="h-full shadow-md border-t-4 border-t-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <div className="p-1 rounded-full bg-primary/10">
              <List className="h-4 w-4 text-primary" />
            </div>
            Daily Habits
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            {completedToday} / {habits.length} Today
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 h-[calc(100%-100px)] overflow-auto">
        {pendingHabits.length > 0 ? (
          <div className="space-y-2">
            {pendingHabits.map((habit) => (
              <motion.div 
                key={habit.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors border border-border/50"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {habit.isPositive ? (
                    <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                      <ArrowDownCircle className="h-4 w-4 text-rose-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{habit.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{habit.description}</p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={() => completeHabitForToday(habit.id)}
                  className="flex-shrink-0 hover:bg-primary/10"
                >
                  <Check className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Complete</span>
                </Button>
              </motion.div>
            ))}
          </div>
        ) : habits.length > 0 ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-500/10 mb-3">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-base font-medium">All habits completed for today!</p>
            <p className="text-sm text-muted-foreground mt-1">Great job staying consistent</p>
          </div>
        ) : (
          <div className="text-center py-8 flex flex-col items-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-3">
              <Plus className="h-7 w-7 text-primary" />
            </div>
            <p className="text-base font-medium">No habits created yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Build your first habit to start tracking</p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link to="/habits">Create Habit</Link>
            </Button>
          </div>
        )}
        
        {habitsCloseToTarget.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm font-medium mb-3 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
              Almost there!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {habitsCloseToTarget.slice(0, 4).map(habit => (
                <div key={habit.id} className="flex flex-col p-3 rounded-md bg-amber-500/10 border border-amber-500/30">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium truncate mr-2">{habit.name}</span>
                    <Badge variant="outline" className={`text-xs whitespace-nowrap ${habit.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {habit.currentStreak} / {habit.targetDays}
                    </Badge>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                    <div 
                      className="h-full bg-amber-500"
                      style={{ width: `${(habit.currentStreak / habit.targetDays) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          asChild 
          className="w-full justify-between hover:bg-muted/50"
        >
          <Link to="/habits">
            Manage All Habits
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HabitWidget;
