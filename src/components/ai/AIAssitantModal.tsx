import { useState, useRef, useEffect, FormEvent } from 'react';
import { Clock, Lightbulb, ArrowRightCircle, Loader2, Mic, MicOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAI } from '@/context/AIContext';
import { cn } from '@/lib/utils';
import AnimatedLogo from '../ui/animated-logo';
import axios from 'axios';
import { toast } from 'sonner';

interface AIAssistantProps {
    initialOpen?: boolean;
}

const AIAssistant = ({ initialOpen = false }: AIAssistantProps) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [prompt, setPrompt] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { processText, actionHistory, clearActionHistory, settings } = useAI();
    const formRef = useRef<HTMLFormElement>(null);


    // Voice recording states
    const [isRecording, setIsRecording] = useState(false);
    const [recordingError, setRecordingError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (initialOpen) {
            setIsOpen(true);
        }
    }, [initialOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                if (!isProcessing && !isRecording) {
                    setIsOpen(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isProcessing, isRecording]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen && isRecording) {
            stopRecording();
        }
    }, [isOpen]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt.trim() || isProcessing) return;

        try {
            setIsProcessing(true);
            await processText(prompt);
            setPrompt('');
            setIsOpen(true);
        } catch (error) {
            console.error('Error processing prompt:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExampleClick = (exampleText: string) => {
        setPrompt(exampleText);
    };

    const startRecording = async () => {
        setRecordingError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            });

            mediaRecorder.addEventListener('error', (error) => {
                console.error('Media recording error:', error);
                setRecordingError('Recording error occurred');
                setIsRecording(false);
                stopStreamTracks(stream);
            });

            mediaRecorder.addEventListener('stop', async () => {
                if (audioChunksRef.current.length > 0) {
                    await processRecording();
                }
                stopStreamTracks(stream);
            });

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);

            let errorMessage = 'Unable to access microphone';

            if (error instanceof DOMException) {
                if (error.name === 'NotAllowedError') {
                    errorMessage = 'Microphone access denied. Please allow microphone permissions.';
                } else if (error.name === 'NotFoundError') {
                    errorMessage = 'No microphone found. Please connect a microphone and try again.';
                } else if (error.name === 'NotReadableError') {
                    errorMessage = 'Microphone is busy or unavailable.';
                }
            }

            setRecordingError(errorMessage);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            audioChunksRef.current = [];

            if (mediaRecorderRef.current.stream) {
                stopStreamTracks(mediaRecorderRef.current.stream);
            }

            mediaRecorderRef.current = null;
        }
    };

    const stopStreamTracks = (stream: MediaStream) => {
        stream.getTracks().forEach(track => track.stop());
    };

    const processRecording = async () => {
        if (audioChunksRef.current.length === 0) return;

        try {
            setIsProcessing(true);

            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/speech`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success && response.data.text) {

                setPrompt(response.data.text);


                if (settings.autoProcess) {
                    await processText(response.data.text);
                    setPrompt('');
                }
            } else {
                setRecordingError('Failed to process speech. Please try again.');
            }
        } catch (error) {
            console.error('Error processing recording:', error);
            setRecordingError('Error processing speech. Please try again.');
        } finally {
            setIsProcessing(false);
            audioChunksRef.current = [];
        }
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
            <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open && (isProcessing || isRecording)) {
                    return;
                }

                if (!open) {
                    if (isRecording) {
                        stopRecording();
                    }
                    setRecordingError(null);
                }
                setIsOpen(open);
            }}>
                <DialogContent aria-describedby="AI Assistant Dialog" className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AnimatedLogo width={60} height={60} isProcessing={isProcessing} />
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} ref={formRef} className="relative">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input
                                    ref={inputRef}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Tell me what to do..."
                                    className="pr-10 border-neutral-500"
                                    disabled={isProcessing || isRecording}
                                />
                                {isProcessing ? (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        disabled={isProcessing || !prompt.trim() || isRecording}
                                    >
                                        <ArrowRightCircle className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            {settings.speechRecognitionEnabled && <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                disabled={isProcessing}
                                className={cn(
                                    "h-10 w-10 ",
                                    isRecording && "bg-red-100 text-red-500 border-red-300"
                                )}
                                onClick={isRecording ? stopRecording : startRecording}
                                title={isRecording ? "Stop recording" : "Start voice recording"}
                            >
                                {isRecording ? (
                                    <MicOff className="h-4 w-4 animate-pulse" />
                                ) : (
                                    <Mic className="h-4 w-4" />
                                )}
                            </Button>}
                        </div>

                        {recordingError && (
                            <div className="text-red-500 text-xs mt-1">
                                {recordingError}
                            </div>
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
                                        disabled={isRecording}
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
                                        disabled={isRecording}
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
                                            <span className=" line-clamp-1 flex-1 ">{action.text}</span>
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