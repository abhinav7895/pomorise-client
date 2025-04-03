import React, { useEffect, useState } from 'react';
import TimerSettings from '@/components/timer/TimerSettings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTimer } from '@/context/TimerContext';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { useUserStore } from '@/store/userStore';
import AuthDialog from '@/components/setting/AuthDialog';
import { VoiceAISettings } from '@/components/text-voice-assistant/assistant';
import { useAI } from '@/context/AIContext';
import { FlaskConical } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let deferredPrompt: any;

const Settings: React.FC = () => {
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const { settings, updateSettings } = useTimer();
  const { user } = useUserStore();
  const { settings: aiSetting, updateSettings: updateAISettings } = useAI();

  const alarmSounds = [
    { file: 'Alarm Bell.mp3', displayName: 'Alarm Bell' },
    { file: 'Alarm Bird.mp3', displayName: 'Bird Chirp' },
    { file: 'Digital Alarm.mp3', displayName: 'Digital Beep' },
    { file: 'Focus Alarm 1 Hour.mp3', displayName: 'Focus Alarm' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt = event;
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }
      deferredPrompt = null;
    }
  };

  const handleVoiceAIToggle = () => {
    updateAISettings({ enabled: !aiSetting.enabled });
  };

  return (
    <>
      <SEO
        title="Pomodoro Timer Settings - Customize Your Experience"
        description="Adjust timer durations, notifications, and sound settings for your Pomodoro productivity app."
        keywords="pomodoro settings, timer customization, productivity app settings"
        canonicalUrl="https://pomorise.vercel.app/settings"
      />
      <motion.div className="space-y-8 animate-fade-in" variants={container} initial="hidden" animate="show" role="main">
        <motion.h1 variants={item} className="text-2xl font-semibold">Settings</motion.h1>

        {showInstallButton && (
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Install App</CardTitle>
                <CardDescription>Install this application to your device for a better experience</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleInstallClick}>Install Now</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Timer Settings Card */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
              <CardDescription>Customize your timer durations and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsTimerSettingsOpen(true)}>Open Timer Settings</Button>
              <TimerSettings open={isTimerSettingsOpen} onOpenChange={setIsTimerSettingsOpen} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Voice & AI Assistant Card */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between gap-1'>AI Assistant <span className='border-dashed border px-2 bg-neutral-900/40 text-neutral-700 border-neutral-700 text-xs'>Beta</span></CardTitle>
              <CardDescription>Enable voice commands and AI processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="voiceAIEnabled">AI Assistant</Label>
                  <div className="text-xs text-muted-foreground">
                    Enable AI processing
                  </div>
                </div>
                <Switch
                  id="aiEnabled"
                  checked={aiSetting.enabled}
                  onCheckedChange={handleVoiceAIToggle}
                  aria-label="Toggle ai assistant"
                />
              </div>
              
              {aiSetting.enabled && <Separator />}

              <VoiceAISettings />
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications & Sounds Card */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Notifications & Sounds</CardTitle>
              <CardDescription>Manage notification, sound, and alarm settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Browser Notifications</Label>
                  <div className="text-xs text-muted-foreground">
                    Receive notifications when timer completes
                  </div>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  aria-label="Toggle browser notifications"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="alarmEnabled">Alarm on Timer Completion</Label>
                  <div className="text-xs text-muted-foreground">
                    Play an alarm sound when the timer finishes
                  </div>
                </div>
                <Switch
                  id="alarmEnabled"
                  checked={settings.alarmEnabled}
                  onCheckedChange={(checked) => updateSettings({ alarmEnabled: checked })}
                  aria-label="Toggle alarm sound"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="space-y-0.5">
                  <Label htmlFor="selectedAlarm">Alarm Sound</Label>
                  <div className="text-xs text-muted-foreground">
                    Choose the alarm sound to play when the timer finishes
                  </div>
                </div>
                <Select
                  value={settings.selectedAlarm}
                  onValueChange={(value) => updateSettings({ selectedAlarm: value })}
                  disabled={!settings.alarmEnabled}
                >
                  <SelectTrigger id="selectedAlarm" aria-label="Select alarm sound">
                    <SelectValue placeholder="Select an alarm sound" />
                  </SelectTrigger>
                  <SelectContent>
                    {alarmSounds.map((sound) => (
                      <SelectItem key={sound.file} value={sound.file}>
                        {sound.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <AuthDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
};

export default Settings;