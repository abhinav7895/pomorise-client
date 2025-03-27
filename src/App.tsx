import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./context/ThemeContext";
import { TimerProviderWithTasks } from "./context/TimerContext";
import { TaskProvider } from "./context/TaskContext";
import { HabitProvider } from "./context/HabitContext";
import { JournalProvider } from "./context/JournalContext";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
const Index = lazy(() => import('./pages/Index'));
const About = lazy(() => import('./pages/About'));
const Settings = lazy(() => import('./pages/Settings'));
const Habits = lazy(() => import('./pages/Habits'));
const Insights = lazy(() => import('./pages/Insights'));
const Journal = lazy(() => import('./pages/Journal')); 
const NotFound = lazy(() => import('./pages/NotFound'));

export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/50 z-50">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);


const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <TooltipProvider>
        <TaskProvider>
          <TimerProviderWithTasks>
            <HabitProvider>
              <JournalProvider> 
                <Toaster />
                <Sonner richColors position="top-left" />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path='/' >
                      <Route element={<Layout />}>
                      <Route path="" element={<Index />} />
                      <Route path="about" element={<About />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="habits" element={<Habits />} />
                      <Route path="insights" element={<Insights />} />
                      <Route path="journal" element={<Journal />} /> 
                      </Route>
                    </Route>
                  <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Routes>
                  </Routes>
                </Suspense>
              </JournalProvider>
            </HabitProvider>
          </TimerProviderWithTasks>
        </TaskProvider>
      </TooltipProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;