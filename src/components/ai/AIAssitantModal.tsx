import { useState, useRef, useEffect, FormEvent, useCallback } from 'react';
import {  Clock, Lightbulb, ArrowRightCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAI } from '@/context/AIContext';
import { cn } from '@/lib/utils';
import AnimatedLogo from '../ui/animated-logo';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const inputRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { processText, actionHistory, clearActionHistory } = useAI();
    const formRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [isOpen]);


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt.trim() || isProcessing) return;

        try {
            setIsProcessing(true);
            await processText(prompt);
            setPrompt('');
        } catch (error) {
            console.error('Error processing prompt:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExampleClick = (exampleText: string) => {
        setPrompt(exampleText);
    };

    const examples = [
        { text: "Add task to buy groceries", icon: <ArrowRightCircle className="h-4 w-4" /> },
        { text: "Start my meditation habit", icon: <ArrowRightCircle className="h-4 w-4" /> },
        { text: "Add journal entry about today", icon: <ArrowRightCircle className="h-4 w-4" /> },
        { text: "Complete my reading habit", icon: <ArrowRightCircle className="h-4 w-4" /> },
    ];

    return (
        <>
            <button
                type="button"
                className="size-[30px] flex justify-center items-center"
                onClick={() => setIsOpen(true)}
                title="AI Assistant (Ctrl+K)"
            >
                <AnimatedLogo height={30} width={30} isProcessing={true} />
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent aria-describedby='AI Assitant Dialog' className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AnimatedLogo width={25} height={25} isProcessing={isProcessing} />
                            AI Assistant
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} ref={formRef} className="relative">
                        <Input
                            ref={inputRef}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Tell me what to do..."
                            className="pr-10 border-neutral-500"
                            disabled={isProcessing}
                        />
                        {isProcessing ? (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                disabled={isProcessing || !prompt.trim()}
                            >
                                <ArrowRightCircle className="h-4 w-4" />
                            </button>
                        )}
                    </form>

                    <div className="space-y-4 mt-2">
                        <div>
                            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                                <Lightbulb className="h-4 w-4 text-primary" />
                                Examples
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {examples.map((example, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="flex items-center gap-2 text-sm p-2 border border-dashed rounded hover:bg-secondary/50 transition-colors text-left"
                                        onClick={() => handleExampleClick(example.text)}
                                    >
                                        {example.icon}
                                        <span>{example.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {actionHistory.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        Recent Actions
                                    </h3>
                                    <Button
                                        type="button" 
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault(); 
                                            clearActionHistory();
                                        }}
                                        className="h-6 text-xs"
                                    >
                                        Clear
                                    </Button>
                                </div>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    {actionHistory.slice(0, 5).map((action, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "text-sm p-2 border border-dashed rounded flex items-center gap-2",
                                                action.success ? "border-green-500/30" : "border-red-500/30"
                                            )}
                                        >
                                            <span className="truncate flex-1">{action.text}</span>
                                            <span className="text-xs opacity-70">
                                                {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-muted-foreground mt-2 text-center">
                        Press <kbd className="px-1 py-0.5 border border-dashed rounded">Esc</kbd> to close or <kbd className="px-1 py-0.5 border border-dashed rounded">Ctrl+K</kbd> to open
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AIAssistant;