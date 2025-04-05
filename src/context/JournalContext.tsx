import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

interface JournalContextType {
  journals: JournalEntry[];
  addJournal: (title: string, content: string) => void;
  updateJournal: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  archiveJournal: (id: string) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const savedJournals = localStorage.getItem('journals');
    return savedJournals ? JSON.parse(savedJournals) : [];
  });

  useEffect(() => {
    localStorage.setItem('journals', JSON.stringify(journals));
  }, [journals]);

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  const addJournal = (title: string, content: string) => {
    const newJournal: JournalEntry = {
      id: generateId(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
    };
    
    setJournals(prev => [newJournal, ...prev]);
    
    toast.success("Journal Entry Added", {
      description: `"${title}" has been saved successfully.`
    });
  };

  const updateJournal = (id: string, updates: Partial<JournalEntry>) => {
    setJournals(prev =>
      prev.map(journal =>
        journal.id === id
          ? { ...journal, ...updates, updatedAt: new Date().toISOString() }
          : journal
      )
    );
  };

  const deleteJournal = (id: string) => {
    const journalToDelete = journals.find(j => j.id === id);
    setJournals(prev => prev.filter(journal => journal.id !== id));
    
    if (journalToDelete) {
      toast.error("Journal Entry Deleted", {
        description: `"${journalToDelete.title}" has been removed.`
      });
    }
  };

  const archiveJournal = (id: string) => {
    const journalToArchive = journals.find(j => j.id === id);
    setJournals(prev =>
      prev.map(journal =>
        journal.id === id
          ? { ...journal, isArchived: !journal.isArchived }
          : journal
      )
    );
    
    if (journalToArchive) {
      toast.info(journalToArchive.isArchived ? "Journal Unarchived" : "Journal Archived", {
        description: `"${journalToArchive.title}" has been ${journalToArchive.isArchived ? "unarchived" : "archived"}.`
      });
    }
  };

  return (
    <JournalContext.Provider value={{ journals, addJournal, updateJournal, deleteJournal, archiveJournal }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournals = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournals must be used within a JournalProvider');
  }
  return context;
};