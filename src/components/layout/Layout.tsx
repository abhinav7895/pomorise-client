
import React, { Suspense, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Settings, Info,  House, Brain, Target, BookOpen } from 'lucide-react';
import { PageLoader } from '@/App';

const Layout: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  const NavLinks = () => (
    <>
      <Link 
        to="/"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${
          location.pathname === '/' 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'hover:bg-secondary/80'
        }`}
      >
        <House className='size-5' />
      </Link>
      <Link 
        to="/insights"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${
          location.pathname === '/insights' 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'hover:bg-secondary/80'
        }`}
      >
        <Brain className='size-5' />
      </Link>
      <Link 
        to="/journal"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${
          location.pathname === '/journal' 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'hover:bg-secondary/80'
        }`}
      >
        <BookOpen className='size-5' />
      </Link>
      <Link 
        to="/habits"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${
          location.pathname === '/habits' 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'hover:bg-secondary/80'
        }`}
      ><Target className='size-5' />
      </Link>
      <Link 
        to="/settings"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${
          location.pathname === '/settings' 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'hover:bg-secondary/80'
        }`}
      >
        <Settings className='size-5' />
      </Link>
      <Link 
        to="/about"
        className={`p-2 border border-dashed flex items-center gap-2 transition-colors ${
          location.pathname === '/about' 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'hover:bg-secondary/80'
        }`}
      >
        <Info className='size-5' />
      </Link>
    </>
  );

  return (
    <div className='w-full'> 
      <div className=" max-w-3xl mx-auto flex flex-col bg-background transition-colors duration-300">
      <header className="w-full px-2 py-4 flex justify-between items-center border-b border-dashed border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="flex items-center">
          { (
            <div className="flex items-center space-x-1">
              <NavLinks />
            </div>
          )}
        </div>
        

      </header>
      
      <main className="flex-1 transition-all duration-300 ease-in-out">
        <div className=" px-4 py-8 animate-fade-in">
        <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
        </div>
      </main>

    </div>
    </div>
  );
};

export default Layout;
