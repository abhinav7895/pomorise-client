import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useTasks } from './TaskContext';
import { useHabits } from './HabitContext';
import { useJournals } from './JournalContext';
import axios from 'axios';

export interface AISettings {
  enabled: boolean;
  speechRecognitionEnabled: boolean;
  autoProcess: boolean;
}

interface ActionHistory {
  type: string;
  action: string;
  text: string;
  success: boolean;
  timestamp: Date;
}

interface AIContextType {
  settings: AISettings;
  actionHistory: ActionHistory[];
  startListening: () => void;
  stopListening: () => void;
  updateSettings: (settings: Partial<AISettings>) => void;
  processText: (text: string) => Promise<void>;
  clearActionHistory: () => void;
}

const defaultSettings: AISettings = {
  enabled: true,
  speechRecognitionEnabled: true,
  autoProcess: false,
};

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AISettings>(() => {
    try {
      const storedSettings = localStorage.getItem('aiSettings');
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      console.error('Error loading AI settings:', error);
      return defaultSettings;
    }
  });

  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);
  const { toast } = useToast();
  
  const { 
    tasks, 
    addTask, 
    updateTask, 
    completeTask, 
    deleteTask, 
    clearCompletedTasks 
  } = useTasks();
  
  const { 
    habits, 
    addHabit, 
    updateHabit, 
    completeHabitForToday, 
    removeHabit, 
    resetHabitStreak 
  } = useHabits();
  
  const { 
    journals, 
    addJournal, 
    updateJournal, 
    deleteJournal, 
    archiveJournal 
  } = useJournals();

  useEffect(() => {
    localStorage.setItem('aiSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('aiActionHistory', JSON.stringify(actionHistory));
  }, [actionHistory]);

  const addToHistory = useCallback((action: Omit<ActionHistory, 'timestamp'>, success: boolean) => {
    setActionHistory(prev => [
      {
        ...action,
        timestamp: new Date(),
        success
      },
      ...prev.slice(0, 49) 
    ]);
  }, []);

  const clearActionHistory = useCallback(() => {
    setActionHistory([]);
  }, []);

  const processText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    try {
      const context = {
        tasks: tasks.map(t => ({ id: t.id, title: t.title })),
        habits: habits.map(h => ({ id: h.id, name: h.name })),
        journals: journals.map(j => ({ id: j.id, title: j.title })),
        currentTime: new Date().toISOString()
      };

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/action`, { text, context });

      if (!data.success || !data.data) {
        throw new Error('Failed to determine action');
      }

      const action = data.data;
      let success = false;

      switch (action.type) {
        case 'tasks':
          success = await handleTaskAction(action);
          break;
        case 'habits':
          success = await handleHabitAction(action);
          break;
        case 'journal':
          success = await handleJournalAction(action);
          break;
        default:
          toast({
            title: 'Action processed',
            description: `I understood: "${text}"`,
          });
          success = true;
      }

      addToHistory({
        type: action.type,
        action: action.action,
        text: action.text,
        success: false
      }, success);

      if (!success) {
        toast({
          title: 'Action not completed',
          description: 'Could not complete the requested action',
          variant: 'destructive',
        });
      }

    } catch (error) {
      console.error('Error processing text:', error);
      addToHistory({
        type: 'error',
        action: 'process',
        text: text,
        success: false
      }, false);
      
      toast({
        title: 'Error processing request',
        description: 'Could not determine action from your input',
        variant: 'destructive',
      });
    }
  }, [tasks, habits, journals]);

  
  const handleTaskAction = useCallback(async (action: {
    action: string;
    id?: string;
    title?: string;
    estimatedPomodoros?: number;
    notes?: string;
  }) => {
    try {
      switch (action.action) {
        case 'add':
          if (!action.title) throw new Error('Title is required');
          await addTask(
            action.title,
            action.estimatedPomodoros || 1,
            action.notes
          );
          toast({
            title: 'Task added',
            description: `"${action.title}" has been added to your tasks.`,
          });
          return true;

        case 'update':
          if (!action.id) throw new Error('ID is required for update');
          if (!action.title) throw new Error('Title is required for update');
          await updateTask(action.id, { 
            title: action.title,
            estimatedPomodoros: action.estimatedPomodoros,
            notes: action.notes
          });
          toast({
            title: 'Task updated',
            description: `Task has been updated.`,
          });
          return true;

        case 'complete':
          if (!action.id) throw new Error('ID is required for completion');
          await completeTask(action.id);
          toast({
            title: 'Task completed',
            description: `Task marked as completed.`,
          });
          return true;

        case 'delete':
          if (!action.id) throw new Error('ID is required for deletion');
          await deleteTask(action.id);
          toast({
            title: 'Task deleted',
            description: `Task has been removed.`,
          });
          return true;

        case 'clear':
          await clearCompletedTasks();
          toast({
            title: 'Completed tasks cleared',
            description: 'All completed tasks have been removed.',
          });
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error('Error handling task action:', error);
      return false;
    }
  }, [addTask, updateTask, completeTask, deleteTask, clearCompletedTasks]);

  const handleHabitAction = useCallback(async (action: {
    action: string;
    id?: string;
    name?: string;
    description?: string;
    isPositive?: boolean;
    targetDays?: number;
  }) => {
    try {
      switch (action.action) {
        case 'add':
          if (!action.name) throw new Error('Name is required');
          await addHabit({
            name: action.name,
            description: action.description || '',
            isPositive: action.isPositive !== false,
            targetDays: action.targetDays || 7,
            color: '',
            reminderTime: '',
            stackedWith: ''
          });
          toast({
            title: 'Habit added',
            description: `"${action.name}" habit has been created.`,
          });
          return true;

        case 'update':
          if (!action.id) throw new Error('ID is required for update');
          await updateHabit(action.id, {
            name: action.name,
            description: action.description,
            isPositive: action.isPositive,
            targetDays: action.targetDays
          });
          toast({
            title: 'Habit updated',
            description: `Habit has been updated.`,
          });
          return true;

        case 'complete':
          if (!action.id) throw new Error('ID is required for completion');
          await completeHabitForToday(action.id);
          toast({
            title: 'Habit completed',
            description: `Habit marked as completed for today.`,
          });
          return true;

        case 'delete':
          if (!action.id) throw new Error('ID is required for deletion');
          await removeHabit(action.id);
          toast({
            title: 'Habit removed',
            description: `Habit has been removed.`,
          });
          return true;

        case 'reset':
          if (!action.id) throw new Error('ID is required for reset');
          await resetHabitStreak(action.id);
          toast({
            title: 'Habit streak reset',
            description: `Habit streak has been reset.`,
          });
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error('Error handling habit action:', error);
      return false;
    }
  }, [addHabit, updateHabit, completeHabitForToday, removeHabit, resetHabitStreak]);

  const handleJournalAction = useCallback(async (action: {
    action: string;
    id?: string;
    title?: string;
    content?: string;
  }) => {
    try {
      switch (action.action) {
        case 'add':
          await addJournal(
            action.title || 'New journal entry',
            action.content || ''
          );
          toast({
            title: 'Journal entry added',
            description: 'Your thoughts have been saved.',
          });
          return true;

        case 'update':
          if (!action.id) throw new Error('ID is required for update');
          await updateJournal(action.id, {
            title: action.title,
            content: action.content
          });
          toast({
            title: 'Journal updated',
            description: 'Journal entry has been updated.',
          });
          return true;

        case 'delete':
          if (!action.id) throw new Error('ID is required for deletion');
          await deleteJournal(action.id);
          toast({
            title: 'Journal deleted',
            description: 'Journal entry has been removed.',
          });
          return true;

        case 'archive':
          if (!action.id) throw new Error('ID is required for archiving');
          await archiveJournal(action.id);
          toast({
            title: 'Journal archived',
            description: 'Journal entry has been archived.',
          });
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error('Error handling journal action:', error);
      return false;
    }
  }, [addJournal, updateJournal, deleteJournal, archiveJournal]);


  // pending
  const startListening = useCallback(() => {
  }, [toast]);

  const stopListening = useCallback(() => {
    // No-op for now
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AISettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  return (
    <AIContext.Provider value={{
      settings,
      actionHistory,
      startListening,
      stopListening,
      updateSettings,
      processText,
      clearActionHistory,
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};