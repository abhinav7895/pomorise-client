import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./context/ThemeContext";
import { TimerProviderWithTasks } from "./context/TimerContext";
import { TaskProvider } from "./context/TaskContext";
import { HabitProvider } from "./context/HabitContext";
import { JournalProvider } from "./context/JournalContext";
import { AIProvider } from "./context/AIContext";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import InstallPrompt from './components/setting/InstallButton';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Index = lazy(() => import('./pages/Index'));
const Tasks = lazy(() => import('./pages/Tasks'));
const About = lazy(() => import('./pages/About'));
const Settings = lazy(() => import('./pages/Settings'));
const Habits = lazy(() => import('./pages/Habits'));
const Insights = lazy(() => import('./pages/Insights'));
const Journal = lazy(() => import('./pages/Journal'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const PageLoader = () => (
  <div className="fixed select-none flex-col inset-0 flex items-center justify-center bg-background/50 z-50">
    <Loader2 className="size-8 mt-3 animate-spin-fast text-primary" />
  </div>
);

const LandingPageWrapper = () => {
  const hasSeenLanding = localStorage.getItem('hasSeenLanding');

  if (hasSeenLanding) {
    return <Navigate to="/home" replace />;
  }

  return <LandingPage />;
};


const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <TaskProvider>
            <TimerProviderWithTasks>
              <HabitProvider>
                <JournalProvider>
                  <AIProvider>
                    <Sonner richColors position="top-right" />
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path='/' element={<LandingPageWrapper />} />
                        <Route element={<Layout />}>
                          <Route path="/home" element={<Index />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/habits" element={<Habits />} />
                          <Route path="/insights" element={<Insights />} />
                          <Route path="/journal" element={<Journal />} />
                          <Route path="/tasks" element={<Tasks />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                    <InstallPrompt />
                  </AIProvider>
                </JournalProvider>
              </HabitProvider>
            </TimerProviderWithTasks>
          </TaskProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;