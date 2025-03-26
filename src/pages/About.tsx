import React from 'react';
import { ExternalLink } from 'lucide-react';
import SEO from '@/components/SEO';

const About: React.FC = () => {
  return (
    <>
    <SEO
        title="About Pomodoro Timer - Learn the Technique & Features"
        description="Discover the Pomodoro Technique history and how our app enhances productivity with timer, tasks, and habits."
        keywords="pomodoro technique, about pomodoro, productivity method, time management technique"
        canonicalUrl="https://pomorise.vercel.app/about"
      />
      <div className="mx-auto  animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">About Pomodoro Timer</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-medium mb-3">The Pomodoro Technique</h2>
            <p className="text-muted-foreground">
              The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. 
              It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Add tasks to work on today</li>
              <li>Set estimate pomodoros (1 = 25min) for each task</li>
              <li>Select a task to work on</li>
              <li>Start timer and focus on the task</li>
              <li>Take a break when the timer rings</li>
              <li>After 4 pomodoros, take a longer break</li>
            </ol>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-3">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Responsive timer with visual state indication</li>
              <li>Task management with estimated pomodoros</li>
              <li>Track completed pomodoros</li>
              <li>Customizable timer durations</li>
              <li>Auto-start options for breaks and pomodoros</li>
              <li>Notifications when timers complete</li>
            </ul>
          </section>
          
          <section className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Created with focus and simplicity in mind. <br />
              <a 
                href="https://en.wikipedia.org/wiki/Pomodoro_Technique" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                Learn more about the Pomodoro Technique <ExternalLink className="ml-1 w-3 h-3" />
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
