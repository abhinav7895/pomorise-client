import React, { useState } from 'react';
import { useJournals, JournalEntry } from '@/context/JournalContext';
import { Plus, BookOpen, ArrowLeft, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';

const JournalList: React.FC = () => {
  const { journals, deleteJournal } = useJournals();
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);

  const activeJournals: JournalEntry[] = journals.filter(journal => !journal.isArchived);

  const handleDelete = (id: string) => {
    deleteJournal(id);
    setSelectedJournal(null); 
  };

  return (
    <Card className="shadow-md border-t-4 border-t-primary">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <div className="p-1 rounded-full bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          Journals
        </CardTitle>
        <Badge variant="outline" className="font-normal">
          {activeJournals.length} entries
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence>
          {activeJournals.length > 0 ? (
            <div className="space-y-2 mb-2">
              {selectedJournal ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="p-4 border border-dashed rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">{selectedJournal.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(selectedJournal.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {format(new Date(selectedJournal.createdAt), 'MMMM d, yyyy')}
                    </p>
                    <div
                      className="quill-content border-t pt-4 sm:bg-gray-900/70 sm:p-4 font-mono sm:border border-dashed text-foreground"
                      dangerouslySetInnerHTML={{ __html: selectedJournal.content }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 border"
                      onClick={() => setSelectedJournal(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                activeJournals.slice(0, 3).map((journal) => (
                  <motion.div
                    key={journal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex justify-between items-center p-2 hover:border-primary cursor-pointer border border-dashed rounded-md"
                      onClick={() => setSelectedJournal(journal)}
                    >
                      <div>
                        <h3 className="font-medium">{journal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(journal.createdAt), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No journal entries yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                Create your first journal entry to get started
              </p>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full gap-1" asChild>
          <Link to="/journal" state={{ isAdding: true }}>
            <Plus className="h-4 w-4" />
            Add Journal
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalList;