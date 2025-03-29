/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useUserStore } from '@/store/userStore';

const API_URL = import.meta.env.VITE_BACKEND_URL;

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface AuthDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

 const AuthDialog: React.FC<AuthDialogProps> = ({ open, setOpen }) => {
  const { user, token, setUser, clearUser } = useUserStore();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formStep, setFormStep] = useState<'auth' | 'verify'>('auth');
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateForm = (data: FormData) => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!data.email.includes('@')) errors.email = 'Please enter a valid email';
    if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (isSignUp && !data.name.trim()) errors.name = 'Name is required';
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setOpen(false);
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
      setOpen(false);
      toast({ 
        title: 'Logged Out', 
        description: 'You have been logged out successfully.' 
      });
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Account Options' : isSignUp ? 'Sign Up' : 'Sign In'}</DialogTitle>
          <DialogDescription>
            {user ? 'Manage your account settings' : 'Access your account to sync data across devices'}
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <form onSubmit={isSignUp ? handleSignUpSubmit : handleSignInSubmit} className="space-y-4 py-4">
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
  );
};


export default AuthDialog;