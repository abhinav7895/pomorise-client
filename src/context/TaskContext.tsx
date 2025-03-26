
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskContextType {
  tasks: Task[];
  activeTaskId: string | null;
  addTask: (title: string, estimatedPomodoros: number, notes?: string) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  incrementCompletedPomodoros: (taskId: string) => void;
  clearCompletedTasks: () => void;
  setActiveTask: (taskId: string | null) => void;
  getActiveTask: () => Task | null;
  moveTask: (fromIndex: number, toIndex: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    return localStorage.getItem('activeTaskId');
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (activeTaskId) {
      localStorage.setItem('activeTaskId', activeTaskId);
    } else {
      localStorage.removeItem('activeTaskId');
    }
  }, [activeTaskId]);

  const addTask = (title: string, estimatedPomodoros: number, notes?: string) => {
    const newTask: Task = {
      id: generateId(),
      title,
      estimatedPomodoros,
      completedPomodoros: 0,
      isCompleted: false,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, newTask]);
    
    toast({
      title: "Task added",
      description: `"${title}" has been added to your tasks.`,
    });
    
    if (!activeTaskId) {
      setActiveTaskId(newTask.id);
    }
  };

  const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    setTasks(tasks.filter((task) => task.id !== taskId));
    
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
    
    if (taskToDelete) {
      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been removed.`,
      });
    }
  };

  const completeTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
    
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const incrementCompletedPomodoros = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completedPomodoros: task.completedPomodoros + 1,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const clearCompletedTasks = () => {
    const completedCount = tasks.filter(task => task.isCompleted).length;
    
    if (completedCount === 0) return;
    
    setTasks(tasks.filter((task) => !task.isCompleted));
    
    toast({
      title: "Completed tasks cleared",
      description: `${completedCount} completed task${completedCount !== 1 ? 's' : ''} removed.`,
    });
  };


  const setActiveTask = (taskId: string | null) => {
    setActiveTaskId(taskId);
  };

  const getActiveTask = (): Task | null => {
    if (!activeTaskId) return null;
    return tasks.find((task) => task.id === activeTaskId) || null;
  };

  const moveTask = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= tasks.length || toIndex >= tasks.length) {
      return;
    }
    
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedTask);
    setTasks(newTasks);
  };

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activeTaskId,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        incrementCompletedPomodoros,
        clearCompletedTasks,
        setActiveTask,
        getActiveTask,
        moveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
