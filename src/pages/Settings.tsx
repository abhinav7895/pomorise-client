
import React, { useState } from 'react';
import TimerSettings from '@/components/timer/TimerSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const Settings: React.FC = () => {
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <SEO
        title="Pomodoro Timer Settings - Customize Your Experience"
        description="Adjust timer durations, notifications, and sound settings for your Pomodoro productivity app."
        keywords="pomodoro settings, timer customization, productivity app settings"
        canonicalUrl="https://pomorise.vercel.app/settings"
      />
        <motion.div
          className="space-y-8 animate-fade-in "
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={item} className="text-2xl font-semibold">Settings</motion.h1>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Timer Settings</CardTitle>
                <CardDescription>Customize your timer durations and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsTimerSettingsOpen(true)}>
                  Open Timer Settings
                </Button>

                <TimerSettings
                  open={isTimerSettingsOpen}
                  onOpenChange={setIsTimerSettingsOpen}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage notification and sound settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Browser Notifications</Label>
                    <div className="text-xs text-muted-foreground">Receive notifications when timer completes</div>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound">Sound Effects</Label>
                    <div className="text-xs text-muted-foreground">Play sound when timer completes</div>
                  </div>
                  <Switch
                    id="sound"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
    </>
  );
};

export default Settings;
