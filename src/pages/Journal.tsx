// src/pages/Journal.tsx
import React, { useState } from 'react';
import { JournalEntry, useJournals } from '@/context/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Archive, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import SEO from '@/components/SEO';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Journal: React.FC = () => {
    const { journals, addJournal, deleteJournal, archiveJournal } = useJournals();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
    const [showArchived, setShowArchived] = useState(false);

    const activeJournals = journals.filter(j => !j.isArchived);
    const archivedJournals = journals.filter(j => j.isArchived);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && content.trim()) {
            addJournal(title, content);
            setTitle('');
            setContent('');
            setIsAdding(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'link'
    ];

    return (
        <>
            <SEO
                title="Journal - Personal Reflection & Notes"
                description="Keep track of your thoughts and reflections with our journal feature."
                keywords="journal, personal notes, reflection, productivity"
                canonicalUrl="https://pomorise.vercel.app/journal"
            />
            <div className="flex flex-col gap-6 mx-auto w-full">
                {!selectedJournal ? (
                    <>
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Journal</h1>
                            <Button
                                variant="outline"
                                onClick={() => setIsAdding(!isAdding)}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                {isAdding ? 'Cancel' : 'New Entry'}
                            </Button>
                        </div>

                        {isAdding && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full"
                            >
                                <Card className="shadow-md border-t-4 border-t-primary">
                                    <CardHeader>
                                        <CardTitle className="flex flex-col gap-2">
                                            New Journal Entry
                                            <span className="text-sm text-muted-foreground">
                                                {format(new Date(), 'MMMM d, yyyy HH:mm')}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <Input
                                                placeholder="Entry Title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full"
                                            />
                                            <ReactQuill
                                                value={content}
                                                onChange={setContent}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                className="bg-background border border-dashed"
                                                theme="snow"
                                            />
                                            <Button type="submit" className="w-full">
                                                Save Entry
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        <Card className=" bg-transparent sm:bg-card border-none sm:shadow-md sm:border-t-4 border-t-primary">
                            <CardHeader className='p-0 pb-6 sm:p-4'>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <div className="p-1 rounded-full bg-primary/10">
                                            <Plus className="h-4 w-4 text-primary" />
                                        </div>
                                        Entries
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowArchived(!showArchived)}
                                    >
                                        {showArchived ? 'Show Active' : 'Show Archived'}
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='p-0 sm:p-4'>
                                <AnimatePresence>
                                    {(showArchived ? archivedJournals : activeJournals).length > 0 ? (
                                        <div className="space-y-2">
                                            {(showArchived ? archivedJournals : activeJournals).map((journal) => (
                                                <motion.div
                                                    key={journal.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div
                                                        className="flex justify-between items-center p-2 hover:border-primary cursor-pointer border border-dashed"
                                                        onClick={() => setSelectedJournal(journal)}
                                                    >
                                                        <div>
                                                            <h3 className="font-medium">{journal.title}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {format(new Date(journal.createdAt), 'MMMM d, yyyy')}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    archiveJournal(journal.id);
                                                                }}
                                                            >
                                                                <Archive className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteJournal(journal.id);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-10"
                                        >
                                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                                                <Plus className="h-6 w-6 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-medium">No {showArchived ? 'archived' : 'active'} journal entries</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {showArchived ? 'No archived entries found' : 'Create your first journal entry'}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full"
                    >
                        <Card className="sm:shadow-md  bg-transparent sm:bg-card border-none p-0 sm:border-t-4 border-t-primary">
                            <CardHeader className='p-0 pb-4 sm:p-4'>
                                <CardTitle className="flex  flex-col  gap-5">
                                    <div className='flex w-full  items-center justify-between'>
                                        <div>
                                            <Button
                                                variant="ghost"
                                                onClick={() => setSelectedJournal(null)}
                                                className="flex items-center gap-2 border border-dashed"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                <span className='hidden sm:block'>  Back</span>
                                            </Button>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => archiveJournal(selectedJournal.id)}
                                            >
                                                <Archive className="h-4 w-4 sm:mr-2" />
                                                <span className='hidden sm:block'> {selectedJournal.isArchived ? 'Unarchive' : 'Archive'}</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    deleteJournal(selectedJournal.id);
                                                    setSelectedJournal(null);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 sm:mr-2" />
                                                <span className='hidden sm:block'>  Delete</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className='mb-2'>
                                        <span className=''>{selectedJournal.title}</span>

                                    </div>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(selectedJournal.createdAt), 'MMMM d, yyyy HH:mm')}
                                </p>
                            </CardHeader>
                            <CardContent className='p-0 sm:p-4'>
                                <div
                                    className="quill-content border-t pt-4 sm:bg-gray-900/70 sm:p-4 font-mono sm:border  border-dashed text-foreground"
                                    dangerouslySetInnerHTML={{ __html: selectedJournal.content }}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default Journal;