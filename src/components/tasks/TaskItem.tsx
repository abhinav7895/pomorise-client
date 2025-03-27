import React from 'react';
import { Trash2, Clock, CheckCircle2, Circle, MoreHorizontal, Play, Loader2, CircleCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTasks } from '@/context/TaskContext';
import { useTimer } from '@/context/TimerContext';
import { Task } from '@/context/TaskContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskItemProps {
  task: Task;
  isActive: boolean;
  compact?: boolean;
}

const TaskItem = ({ task, isActive, compact = false }: TaskItemProps) => {
  const {
    completeTask,
    deleteTask,
    setActiveTask,
  } = useTasks();

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    completeTask(task.id);
  };

  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const {
    isTimerActive,
    startFocusTimerFromBeginning
  } = useTimer();

  const handleStartTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(isRunning) return;
    setActiveTask(task.id);
    startFocusTimerFromBeginning();
  };

  const handleSetActive = () => {
    setActiveTask(task.id);
  };

  const timeAgo = formatDistanceToNow(new Date(task.createdAt), { addSuffix: true });
  const isRunning = isActive && isTimerActive;

  return (
    <div
      className={cn(
        "group relative border p-4 hover:bg-secondary transition-colors",
        isActive ? "bg-primary/10" : "bg-card",
        "dark:bg-card dark:hover:bg-secondary",
        task.isCompleted ? "" : "cursor-pointer"
      )}
      onClick={!task.isCompleted ? handleSetActive : undefined}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="space-y-1 flex-1 min-w-0"> 
          <div className="flex items-center gap-2">
            <h3 
              className="text-lg font-semibold truncate max-w-full" 
              title={task.title} 
            >
              {task.title}
            </h3>
            {task.isCompleted && (
              <Badge variant="secondary" className='bg-transparent text-green-400 p-0'>
                <CircleCheck className='size-4' />
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{task.notes || ''}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>Created {timeAgo}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>Pomodoros: {task.completedPomodoros} / {task.estimatedPomodoros}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-auto flex-shrink-0"> {/* Added flex-shrink-0 to prevent button compression */}
          {!task.isCompleted && (
            <Button
              variant={"outline"}
              size="sm"
              className={cn(
                "flex items-center gap-1 whitespace-nowrap",
                isRunning ? "text-green-600 border hover:bg-green-950" : "text-primary"
              )}
              disabled={isRunning}
              onClick={handleStartTimer}
            >
              {isRunning ? <Loader2 className='animate-spin size-4 flex-shrink-0' /> : <Clock className="w-4 h-4 flex-shrink-0" />}
              <span className="hidden sm:inline">{isRunning ? "Running" : "Start Timer"}</span>
              <span className="sm:hidden">{isRunning ? "Running" : "Start"}</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full flex-shrink-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleToggleComplete}>
                {task.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteTask}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;