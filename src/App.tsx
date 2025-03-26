import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { TimerProviderWithTasks } from "./context/TimerContext";
import { TaskProvider } from "./context/TaskContext";
import { HabitProvider } from "./context/HabitContext";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
const Index = lazy(() => import('./pages/Index'));
const About = lazy(() => import('./pages/About'));
const Settings = lazy(() => import('./pages/Settings'));
const Habits = lazy(() => import('./pages/Habits'));
const Insights = lazy(() => import('./pages/Insights'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/50 z-50">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <TooltipProvider>
        <TaskProvider>
          <TimerProviderWithTasks>
            <HabitProvider>
              <Toaster />
              <Sonner />
              <Suspense fallback={<PageLoader />}>
                <Routes >
                  <Route element={<Layout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/habits" element={<Habits />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </HabitProvider>
          </TimerProviderWithTasks>
        </TaskProvider>
      </TooltipProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;