import React, { useState } from 'react';
import TaskList from '@/components/tasks/TaskList';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import AddTask from '@/components/tasks/AddTask';
import SEO from '@/components/SEO';

const Tasks = () => {
  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <>
      <SEO
        title="Task Manager - Organize Tasks with Pomodoro"
        description="Manage your tasks effectively using our Pomodoro app. Create, organize, and complete tasks to boost productivity."
        keywords="task manager, pomodoro tasks, productivity, time management"
        canonicalUrl="https://pomorise.vercel.app/tasks"
        ogImage='og-task.png'
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
              <h1 className="text-2xl font-bold">Task Manager</h1>
            </div>
            <div className="flex gap-2 px-2">
              <Button 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Task</span>
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">
            Create and organize tasks to boost your productivity.
            Use the Pomodoro technique to stay focused and accomplish more.
          </p>
        </header>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 gap-8">
          {showAddTask ? (
            <AddTask 
              onCancel={() => setShowAddTask(false)}
              onTaskAdded={() => setShowAddTask(false)}
            />
          ) : (
            <TaskList />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Tasks;