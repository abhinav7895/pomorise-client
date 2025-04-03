import React, { Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Settings, Info, House, Brain, Target, BookOpen, CheckSquare } from 'lucide-react';
import { PageLoader } from '@/App';
import AIAssistant from '../ai/AIAssitantModal';
import { useAI } from '@/context/AIContext';


const Layout = () => {
  const location = useLocation();
  const {settings} = useAI()
  const [initialOpen, setInitialOpen] = useState(false);

  useEffect(() => {
    if (location.state?.openAssitant) {
      setInitialOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const NavLinks = () => (
    <nav className="flex items-center md:gap-2 md:space-x-1 max-md:justify-between max-md:w-full">
     {settings.enabled && <AIAssistant initialOpen={initialOpen} />
    }
      <Link
        to="/"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${location.pathname === '/'
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-secondary/80'
          }`}
      >
        <House className='size-5 max-md:size-6' />
      </Link>
      <Link
        to="/insights"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${location.pathname === '/insights'
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-secondary/80'
          }`}
      >
        <Brain className='size-5 max-md:size-6' />
      </Link>
      <Link
        to="/journal"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${location.pathname === '/journal'
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-secondary/80'
          }`}
      >
        <BookOpen className='size-5 max-md:size-6' />
      </Link>
      <Link
        to="/tasks"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${location.pathname === '/tasks'
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-secondary/80'
          }`}
      >
        <CheckSquare className='size-5 max-md:size-6' />
      </Link>
      <Link
        to="/habits"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${location.pathname === '/habits'
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-secondary/80'
          }`}
      >
        <Target className='size-5 max-md:size-6' />
      </Link>
      <Link
        to="/settings"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${location.pathname === '/settings'
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-secondary/80'
          }`}
      >
        <Settings className='size-5 max-md:size-6' />
      </Link>
      

    </nav>
  );

  return (
    <div className="min-h-screen flex mb-[100px] flex-col">
      {/* Desktop Navbar */}
      <header className="hidden md:block w-full px-2 py-4 border-b border-dashed border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <NavLinks />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      {/* Mobile Navbar */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-dashed border-border/40 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <NavLinks />
        </div>
      </footer>
    </div>
  );
};

export default Layout;