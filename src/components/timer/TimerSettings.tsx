import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useTimer } from '@/context/TimerContext';

interface TimerSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ open, onOpenChange }) => {
  const { settings, updateSettings } = useTimer();

  const [localSettings, setLocalSettings] = useState({
    focusDuration: settings.focusDuration / 60,
    shortBreakDuration: settings.shortBreakDuration / 60,
    longBreakDuration: settings.longBreakDuration / 60,
    longBreakInterval: settings.longBreakInterval,
    autoStartBreaks: settings.autoStartBreaks,
    autoStartPomodoros: settings.autoStartPomodoros,
  });

  const handleChange = (field: string, value: number | boolean) => {
    setLocalSettings({
      ...localSettings,
      [field]: value,
    });
  };

  const handleSave = () => {
    updateSettings({
      focusDuration: localSettings.focusDuration * 60,
      shortBreakDuration: localSettings.shortBreakDuration * 60,
      longBreakDuration: localSettings.longBreakDuration * 60,
      longBreakInterval: localSettings.longBreakInterval,
      autoStartBreaks: localSettings.autoStartBreaks,
      autoStartPomodoros: localSettings.autoStartPomodoros,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg shadow-lg backdrop-blur-sm bg-white/90 dark:bg-neutral-950 border border-border/50 animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl">Timer Settings</DialogTitle>
          <DialogDescription>
            Customize your timer to match your workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="focusDuration">Focus Duration</Label>
              <span className="text-sm text-muted-foreground">{localSettings.focusDuration} min</span>
            </div>
            <Slider
              id="focusDuration"
              min={1}
              max={60}
              step={1}
              value={[localSettings.focusDuration]}
              onValueChange={(value) => handleChange('focusDuration', value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="shortBreakDuration">Short Break</Label>
              <span className="text-sm text-muted-foreground">{localSettings.shortBreakDuration} min</span>
            </div>
            <Slider
              id="shortBreakDuration"
              min={1}
              max={15}
              step={1}
              value={[localSettings.shortBreakDuration]}
              onValueChange={(value) => handleChange('shortBreakDuration', value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="longBreakDuration">Long Break</Label>
              <span className="text-sm text-muted-foreground">{localSettings.longBreakDuration} min</span>
            </div>
            <Slider
              id="longBreakDuration"
              min={5}
              max={30}
              step={1}
              value={[localSettings.longBreakDuration]}
              onValueChange={(value) => handleChange('longBreakDuration', value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="longBreakInterval">Long Break Interval</Label>
              <span className="text-sm text-muted-foreground">After {localSettings.longBreakInterval} pomodoros</span>
            </div>
            <Slider
              id="longBreakInterval"
              min={1}
              max={8}
              step={1}
              value={[localSettings.longBreakInterval]}
              onValueChange={(value) => handleChange('longBreakInterval', value[0])}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoStartBreaks" className="flex-1">Auto-start Breaks</Label>
            <Switch
              id="autoStartBreaks"
              checked={localSettings.autoStartBreaks}
              onCheckedChange={(checked) => handleChange('autoStartBreaks', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoStartPomodoros" className="flex-1">Auto-start Pomodoros</Label>
            <Switch
              id="autoStartPomodoros"
              checked={localSettings.autoStartPomodoros}
              onCheckedChange={(checked) => handleChange('autoStartPomodoros', checked)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-6 shadow transition-all">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimerSettings;