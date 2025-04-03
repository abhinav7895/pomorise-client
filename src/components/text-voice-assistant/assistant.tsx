import React, { useState } from 'react';
import { useAI } from '@/context/AIContext';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';


export const VoiceAISettings: React.FC = () => {
    const { settings, updateSettings } = useAI();
    const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(() => {
      if (typeof window !== 'undefined') {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      }
      return false;
    });
    
    const handleToggle = (key: keyof typeof settings) => {
      updateSettings({ [key]: !settings[key] });
    };
    
    const speechUnavailable = settings.speechRecognitionEnabled && !isSpeechSupported;
    
    return (
<>
        {settings.enabled && (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="speechRecognition">Voice Input</Label>
                <div className="text-xs text-muted-foreground">
                  Use microphone for voice commands
                </div>
                {speechUnavailable && (
                  <div className="text-xs text-destructive">
                    Speech recognition is not supported in this browser
                  </div>
                )}
              </div>
              <Switch
                id="speechRecognition"
                checked={settings.speechRecognitionEnabled}
                onCheckedChange={() => handleToggle('speechRecognitionEnabled')}
                disabled={!isSpeechSupported}
                aria-label="Toggle voice input"
              />
            </div>
  
            <Separator />
  
            <div className="space-y-2  ">
              <Label>Example Commands</Label>
              <div className="bg-muted/50 p-4 border border-dashed">
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>"Add task buy groceries"</li>
                  <li>"Create habit exercise daily"</li>
                  <li>"Add journal entry Today was productive"</li>
                  <li>"Complete task report"</li>
                  <li>"Clear completed tasks"</li>
                </ul>
              </div>
            </div>
          </>
        )}
        </>
    );
  };