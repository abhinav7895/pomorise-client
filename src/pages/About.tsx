import React from 'react';
import SEO from '@/components/SEO';
import AnimatedLogo from '@/components/ui/animated-logo';

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About Pomorise - Enhance Productivity with Advanced Features"
        description="Learn about Pomorise, the ultimate productivity app combining the Pomodoro Technique with task management, habit tracking, AI-powered insights, and journaling."
        keywords="pomorise, pomodoro technique, productivity app, time management, habit tracker, ai insights"
        canonicalUrl="https://pomorise.vercel.app/about"
      />
      <div className="mx-auto animate-fade-in">
        <h1 className="text-2xl font-semibold items-center flex gap-2 mb-6">About Pomorise                              <AnimatedLogo height={27} width={27} isProcessing={true} />

        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-medium mb-3">The Pomodoro Technique</h2>
            <p className="text-muted-foreground">
              The Pomodoro Technique, developed by Francesco Cirillo in the late 1980s, is a time management method that breaks work into focused intervals (typically 25 minutes) separated by short breaks. Pomorise builds on this foundation to supercharge your productivity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-3">How to Use Pomorise</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Add tasks to your daily list</li>
              <li>Set estimated pomodoros (1 = 25min) for each task</li>
              <li>Select a task and start the timer</li>
              <li>Focus until the timer rings, then take a break</li>
              <li>After 4 pomodoros, enjoy a longer break</li>
              <li>Track habits, get AI-powered insights, and journal your progress</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-3">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Responsive Pomodoro timer with visual state indication</li>
              <li>Task management with estimated pomodoros and completion tracking</li>
              <li>Customizable timer durations and auto-start options</li>
              <li>Habit tracking inspired by Atomic Habits principles</li>
              <li>AI-powered insights to analyze your productivity patterns</li>
              <li>Journal feature for reflection and note-taking</li>
              <li>Notifications and sound effects for timer completion</li>
              <li>Settings to tailor your experience (timer, notifications, sound)</li>
            </ul>
          </section>

          <section className="pt-4 border-t border-border border-dashed">
            <p className="text-sm text-muted-foreground">
              Pomorise is designed to help you master your time, build lasting habits, and gain deep insights into your productivity—all in one place, enhanced by AI-driven analysis.
              <br />
              <a
                href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                Learn more about the Pomodoro Technique
              </a>
            </p>
          </section>
          <section className="pt-4 border-t border-border border-dashed">
            <div className='mx-auto mt-4'>
              <div className="text-center text-sm text-gray-500 py-4">
                Made with ❤️ by{' '}
                <a
                  href="https://abhinavyadav.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Abhinav Yadav
                </a>
              </div>
              <div className='flex flex-col items-center gap-2 justify-center mt-8'>
              <AnimatedLogo height={90} width={90} isProcessing={true} />

                
                                <div className=" font-semibold text-4xl">Pomorise</div>
              </div>
            </div>
          </section>


        </div>
      </div>
    </>
  );
};

export default About;