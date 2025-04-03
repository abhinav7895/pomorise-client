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
import { AIProvider } from "./context/AIContext";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import InstallPrompt from './components/setting/InstallButton';



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

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <TooltipProvider>
        <TaskProvider>
          <TimerProviderWithTasks>
            <HabitProvider>
              <JournalProvider>
                <AIProvider>
                  <Toaster />
                  <Sonner richColors position="bottom-left" />
                  <Routes>
                    <Route element={<Layout />}>
                      <Route path="/" element={
                        <Suspense fallback={<PageLoader />}>
                          <Index />
                        </Suspense>
                      } />
                      <Route path="/about" element={
                        <Suspense fallback={<PageLoader />}>
                          <About />
                        </Suspense>
                      } />
                      <Route path="/settings" element={
                        <Suspense fallback={<PageLoader />}>
                          <Settings />
                        </Suspense>
                      } />
                      <Route path="/habits" element={
                        <Suspense fallback={<PageLoader />}>
                          <Habits />
                        </Suspense>
                      } />
                      <Route path="/insights" element={
                        <Suspense fallback={<PageLoader />}>
                          <Insights />
                        </Suspense>
                      } />
                      <Route path="/journal" element={
                        <Suspense fallback={<PageLoader />}>
                          <Journal />
                        </Suspense>
                      } />
                      <Route path="/tasks" element={
                        <Suspense fallback={<PageLoader />}>
                          <Tasks />
                        </Suspense>
                      } />
                      <Route path="*" element={
                        <Suspense fallback={<PageLoader />}>
                          <NotFound />
                        </Suspense>
                      } />
                    </Route>
                  </Routes>
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

export default App;