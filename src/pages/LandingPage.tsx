import React, { useState } from 'react';
import SEO from '@/components/SEO';
import AnimatedLogo from '@/components/ui/animated-logo';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Terminal, Calendar, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HowItWorksModal from '@/components/ui/how-it-works';

const LandingPage = ({ onGetStarted } : {onGetStarted ?: () => void}) => {
    const navigate = useNavigate();
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const features = [
    "Pomodoro timer with customizable intervals",
    "Task management with estimated pomodoros",
    "Habit tracking with streak counters",
    "AI assistant for quick actions via chat commands",
    "Journaling for reflection and notes",
    "Detailed productivity analytics"
  ];

  const getStarted = () => {
    onGetStarted();
    navigate("/")
  }

  return (
    <>
      <SEO
        title="Pomorise - Boost Productivity with Pomodoro Technique"
        description="Pomorise combines the Pomodoro technique with task management, habit tracking, and AI insights to help you stay focused and productive."
        keywords="pomodoro, productivity, focus timer, task management, habit tracker, AI assistant"
        canonicalUrl="https://pomorise.vercel.app"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <AnimatedLogo height={32} width={32} isProcessing={true} />
            <span className="text-xl font-semibold">Pomorise</span>
          </div>
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-gray-800"
            onClick={getStarted}
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </header>

        <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-800 mb-6">
              <span className="text-sm font-medium text-primary">v2.0 now available</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Focus smarter, <span className="text-primary">not harder</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Pomorise combines the Pomodoro technique with AI-powered insights to help you stay productive, build habits, and achieve more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="px-8 py-6 text-lg"
                onClick={getStarted}
              >
                Start Focusing Now
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-6 text-lg border-gray-700 hover:bg-gray-800"
                onClick={() => setIsHowItWorksOpen(true)}
              >
                How It Works
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 border-t border-gray-800">
          <p className="text-center text-gray-500 mb-8">Used by solo developers and indie teams</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            {['Indie Hackers', 'Product Hunt', 'Dev.to', 'Hashnode', 'CodePen'].map((community) => (
              <div key={community} className="text-xl font-medium text-gray-400">
                {community}
              </div>
            ))}
          </div>
        </div>

        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-800 mb-6">
                <span className="text-sm font-medium text-primary">New Feature</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet your productivity AI assistant</h2>
              <p className="text-xl text-gray-400 mb-6">
                Use natural language commands to manage your entire workflow without leaving the flow state.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Terminal className="h-5 w-5 text-primary mt-1" />
                  <p className="text-gray-300">"Add a new task to finish the landing page design by Friday"</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <p className="text-gray-300">"Start a daily meditation habit for 10 minutes each morning"</p>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-1" />
                  <p className="text-gray-300">"Create a journal entry about today's achievements"</p>
                </div>
              </div>
              <Button 
                className="px-6 py-2 text-md"
                onClick={() => navigate("/", { state: { openAssitant: true } })}
              >
                Try AI Assistant
              </Button>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-700">
                <Terminal className="h-5 w-5 text-primary" />
                <span className="font-medium">AI Assistant</span>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="bg-gray-700 rounded-lg p-3 max-w-[80%] self-end">
                    <p className="text-sm">Add a pomodoro task to finish the project proposal</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">✅ Added new task "Finish project proposal" with 2 estimated pomodoros to your Today list</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="bg-gray-700 rounded-lg p-3 max-w-[80%] self-end">
                    <p className="text-sm">Create a reading habit for 30 minutes daily</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">✅ Created new habit "Reading" for 30 minutes daily. I'll remind you each day. Would you like to set a specific time?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need to stay productive</h2>
            <p className="text-xl text-gray-400">
              Pomorise brings together the best productivity tools in one seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{feature}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center bg-gray-900/50 border border-gray-800 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your productivity?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Join our growing community of developers and creators who use Pomorise to achieve their goals.
            </p>
            <Button 
              className="px-8 py-6 text-lg"
              onClick={getStarted}
            >
              Get Started for Free
            </Button>
          </div>
        </section>

        <footer className="container flex flex-col items-center w-full mx-auto px-4 py-12 border-t border-gray-800">
          <div className=" flex  justify-center items-center flex-col  gap-5 space-x-2 my-10">
              <AnimatedLogo height={100} width={100} isProcessing={true} />
              <span className="text-6xl font-medium">Pomorise</span>
            </div>
          <div className="flex flex-col w-full md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              Created by <a href="https://abhinavyadav.in" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Abhinav</a>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Pomorise. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      <HowItWorksModal
        isOpen={isHowItWorksOpen} 
        onClose={() => setIsHowItWorksOpen(false)} 
      />
    </>
  );
};

export default LandingPage;