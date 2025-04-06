import React, { useState } from 'react';
import { Task, useTasks } from '@/context/TaskContext';
import { Plus, CheckSquare, Flame } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TaskItem from './TaskItem';
import AddTask from './AddTask';
import { AnimatePresence, motion } from 'framer-motion';

const TaskList = () => {
  const { tasks, getActiveTask, updateTask } = useTasks();
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const activeTask = getActiveTask();
  
  const incompleteTasks = tasks.filter(task => !task.isCompleted);
  
  const handleTaskAdded = () => {
    setShowAddTask(false);
    setEditingTask(null);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };
  
  const handleCancelEdit = () => {
    setEditingTask(null);
  };
  
  const handleTaskUpdated = () => {
    setEditingTask(null);
  };

  return (
    <Card className="shadow-md border-t-4 border-t-primary">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <div className="p-1 rounded-full bg-primary/10">
            <CheckSquare className="h-4 w-4 text-primary" />
          </div>
          Tasks
        </CardTitle>
        <Badge variant="outline" className="font-normal">
          {incompleteTasks.length} pending
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {showAddTask ? (
          <AddTask 
            onCancel={() => setShowAddTask(false)} 
            onTaskAdded={handleTaskAdded}
          />
        ) : editingTask ? (
          <AddTask 
            taskToEdit={editingTask}
            onCancel={handleCancelEdit}
            onTaskAdded={handleTaskUpdated}
          />
        ) : (
          <AnimatePresence>
            {tasks.length > 0 ? (
              <div className="space-y-2 mb-2">
                {/* Active tasks section */}
                {incompleteTasks.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-primary" />
                      Active Tasks
                    </h3>
                    {incompleteTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <TaskItem 
                          task={task} 
                          isActive={activeTask?.id === task.id} 
                          onEdit={handleEditTask}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Completed tasks section */}
                {tasks.filter(t => t.isCompleted).length > 0 && (
                  <div className="space-y-2 mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Completed Tasks
                    </h3>
                    {tasks.filter(t => t.isCompleted).map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <TaskItem 
                          task={task} 
                          isActive={activeTask?.id === task.id}
                          onEdit={handleEditTask}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No tasks yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-6">Create your first task to get started</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full gap-1"
          onClick={() => {
            setShowAddTask(!showAddTask);
            setEditingTask(null);
          }}
          disabled={!!editingTask}
        >
          <Plus className="h-4 w-4" />
          {showAddTask ? "Cancel" : "Add Task"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskList;