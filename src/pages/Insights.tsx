import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/context/TaskContext';
import { useHabits } from '@/context/HabitContext';
import { useJournals } from '@/context/JournalContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Lightbulb, Star, Check, AlertTriangle, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';

const Insights: React.FC = () => {
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const { journals } = useJournals();

  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<{
    insights: {
      story: string;
      tips: string[];
      feedback: string;
      areasToImprove: string[];
    };
  } | null>(() => {
    const stored = localStorage.getItem('insights_data');
    return stored ? JSON.parse(stored) : null;
  });
  const [lastFetched, setLastFetched] = useState<string | null>(localStorage.getItem('insights_last_fetched'));
  const [timeUntilNextRefresh, setTimeUntilNextRefresh] = useState<number | null>(null);

  const REFRESH_COOLDOWN = 5 * 60 * 1000; // 5 minutes wait time

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const canRefresh = useCallback(() => {
    if (!lastFetched) return true;
    const now = new Date().getTime();
    const lastFetchTime = new Date(lastFetched).getTime();
    return now - lastFetchTime >= REFRESH_COOLDOWN;
  }, [lastFetched, REFRESH_COOLDOWN]);

  const updateTimeUntilRefresh = useCallback(() => {
    if (!lastFetched) {
      setTimeUntilNextRefresh(null);
      return;
    }
    const now = new Date().getTime();
    const lastFetchTime = new Date(lastFetched).getTime();
    const timeElapsed = now - lastFetchTime;
    const timeRemaining = REFRESH_COOLDOWN - timeElapsed;

    if (timeRemaining > 0) {
      setTimeUntilNextRefresh(timeRemaining);
    } else {
      setTimeUntilNextRefresh(null);
    }
  }, [lastFetched, REFRESH_COOLDOWN]);

  const fetchInsights = useCallback(async () => {
    if (!canRefresh()) {
      toast.info(`Please wait ${formatTimeRemaining(timeUntilNextRefresh || 0)} before refreshing again.`, {
        description: 'Refresh Cooldown',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/insights`,
        { habits, tasks, journals },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = response.data;
      setInsights(data);
      localStorage.setItem('insights_data', JSON.stringify(data));
      const now = new Date().toISOString();
      setLastFetched(now);
      localStorage.setItem('insights_last_fetched', now);

      toast.success('Your personalized insights are ready!', {
        description: 'Insights Generated',
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast.error('Failed to fetch insights. Please try again.', {
        description: 'Error',
      });
    } finally {
      setLoading(false);
    }
  }, [habits, tasks, journals, timeUntilNextRefresh, canRefresh]);

  useEffect(() => {
    if (!insights) {
      fetchInsights();
    }

    const interval = setInterval(() => {
      updateTimeUntilRefresh();
    }, 1000);

    return () => clearInterval(interval);
  }, [insights, lastFetched, fetchInsights, updateTimeUntilRefresh]);

  return (
    <>
      <SEO
        title="Productivity Insights - Pomodoro Performance Analytics"
        description="Analyze your productivity with personalized insights from your Pomodoro timer usage and habit tracking."
        keywords="productivity insights, pomodoro analytics, task performance"
        canonicalUrl="https://pomorise.vercel.app/insights"
        ogImage='og-insights.png'
      />
      <div className="mx-auto w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              Insights
            </h1>
            {insights && (
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchInsights}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  {loading ? <Loader2 className='animate-spin' /> : "Refresh"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {insights ? (
          <div>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 gap-2 bg-gray-100 dark:bg-gray-800 p-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 transition-all"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="tips"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 transition-all"
                >
                  Tips
                </TabsTrigger>
                <TabsTrigger
                  value="feedback"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 transition-all"
                >
                  Feedback
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="shadow-lg border-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Brain className="h-6 w-6 text-primary" />
                      Your Productivity Story
                    </CardTitle>
                    <CardDescription>
                      Last updated: {lastFetched ? formatDate(lastFetched) : 'Never'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {insights.insights.story}
                    </p>
                    {insights.insights.areasToImprove.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          Areas to Improve
                        </h3>
                        <ul className="space-y-2 pl-4">
                          {insights.insights.areasToImprove.map((area, index) => (
                            <li
                              key={index}
                              className="text-yellow-800 dark:text-yellow-200 flex items-start gap-2"
                            >
                              <Check className="h-4 w-4 mt-1 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tips">
                <Card className="shadow-lg border-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Lightbulb className="h-6 w-6 text-primary" />
                      Personalized Tips
                    </CardTitle>
                    <CardDescription>Actionable advice based on your habits and tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {insights.insights.tips.map((tip, index) => (
                        <li
                          key={index}
                          className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Star className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feedback">
                <Card className="shadow-lg border-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Brain className="h-6 w-6 text-primary" />
                      Performance Feedback
                    </CardTitle>
                    <CardDescription>Your progress analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                        {insights.insights.feedback}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center"
          >
            <Brain className="h-16 w-16 text-primary mb-6" />
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              {loading ? 'Generating your insights...' : 'No insights available yet.'}
            </p>
            {!loading && (
              <Button
                onClick={fetchInsights}
                className="px-6 py-3 bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Generate Insights
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Insights;