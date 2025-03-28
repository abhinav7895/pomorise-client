/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { create } from 'zustand';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface TimerSettings {
  alarmEnabled: boolean;
  selectedAlarm: string;
}

interface UserState {
  user: { id: string; email: string; name?: string } | null;
  token: string | null;
  setUser: (user: { id: string; email: string; name?: string }, token: string) => void;
  clearUser: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
}));

const Settings: React.FC = () => {
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
  const { settings, updateSettings } = useTimer();
  const { user, token, setUser, clearUser } = useUserStore();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formStep, setFormStep] = useState<'auth' | 'verify'>('auth');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

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

  const validateForm = (data: FormData) => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    
    if (!data.email.includes('@')) {
      errors.email = 'Please enter a valid email';
    }
    if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (isSignUp && !data.name.trim()) {
      errors.name = 'Name is required';
    }
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      if (res.status === 201) {
        setFormStep('verify');
        toast({
          title: 'Check your email',
          description: 'A verification link has been sent to your email.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Sign Up Error',
        description: error.response?.data?.error || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/signin`, {
        email: formData.email,
        password: formData.password,
      });
      setUser(
        {
          id: res.data.user.id,
          email: res.data.user.email,
          name: res.data.user.user_metadata?.name,
        },
        res.data.token
      );
      setDialogOpen(false);
      setFormData({ name: '', email: '', password: '' });
      toast({
        title: 'Signed In',
        description: `Welcome back, ${res.data.user.user_metadata?.name || res.data.user.email}!`,
      });
    } catch (error: any) {
      toast({
        title: 'Sign In Error',
        description: error.response?.data?.error || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearUser();
      setDialogOpen(false);
      toast({ title: 'Logged Out', description: 'You have been logged out successfully.' });
    } catch (error: any) {
      toast({
        title: 'Logout Error',
        description: error.response?.data?.error || 'Failed to logout',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
        className="space-y-8 animate-fade-in" 
        variants={container} 
        initial="hidden" 
        animate="show"
        role="main"
      >
        <motion.h1 variants={item} className="text-2xl font-semibold">Settings</motion.h1>

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

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Account & Sync</CardTitle>
              <CardDescription>Manage your account and data synchronization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sync Data</Label>
                  <div className="text-xs text-muted-foreground">
                    Synchronize your data across devices
                  </div>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      {user ? `Logged in as ${user.name || user.email}` : 'Sync Now'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {user ? 'Account Options' : isSignUp ? 'Sign Up' : 'Sign In'}
                      </DialogTitle>
                      <DialogDescription>
                        {user
                          ? 'Manage your account settings'
                          : 'Access your account to sync data across devices'}
                      </DialogDescription>
                    </DialogHeader>

                    {!user ? (
                      <form
                        onSubmit={isSignUp ? handleSignUpSubmit : handleSignInSubmit}
                        className="space-y-4 py-4"
                      >
                        {formStep === 'auth' && (
                          <>
                            {isSignUp && (
                              <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  placeholder="Enter your name"
                                  required
                                  aria-invalid={!!formErrors.name}
                                  aria-describedby={formErrors.name ? "name-error" : undefined}
                                />
                                {formErrors.name && (
                                  <p id="name-error" className="text-sm text-destructive">
                                    {formErrors.name}
                                  </p>
                                )}
                              </div>
                            )}
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                required
                                aria-invalid={!!formErrors.email}
                                aria-describedby={formErrors.email ? "email-error" : undefined}
                              />
                              {formErrors.email && (
                                <p id="email-error" className="text-sm text-destructive">
                                  {formErrors.email}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="password">Password</Label>
                              <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                required
                                aria-invalid={!!formErrors.password}
                                aria-describedby={formErrors.password ? "password-error" : undefined}
                              />
                              {formErrors.password && (
                                <p id="password-error" className="text-sm text-destructive">
                                  {formErrors.password}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                        {isSignUp && formStep === 'verify' && (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              A verification link has been sent to {formData.email}. Please check your inbox (and spam folder).
                            </p>
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => setFormStep('auth')}
                            >
                              Back to Sign Up
                            </Button>
                          </div>
                        )}
                        {formStep === 'auth' && (
                          <div className="space-y-2">
                            <Button
                              type="submit"
                              className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                            </Button>
                            <Button
                              type="button"
                              variant="link"
                              className="w-full text-primary hover:text-primary/80"
                              onClick={() => {
                                setIsSignUp(!isSignUp);
                                setFormStep('auth');
                                setFormErrors({});
                              }}
                            >
                              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                            </Button>
                          </div>
                        )}
                      </form>
                    ) : (
                      <div className="py-4">
                        <Button
                          variant="destructive"
                          onClick={handleLogout}
                          className="w-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Logging out...' : 'Logout'}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
    </>
  );
};


export default Settings;