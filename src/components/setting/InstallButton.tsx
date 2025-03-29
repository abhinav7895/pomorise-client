// src/components/InstallPrompt.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '/logo.svg'; // Adjust path if needed
import { useIsMobile } from '@/hooks/use-mobile';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let deferredPrompt: any;

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
const  isMobile = useIsMobile()
  useEffect(() => {
    const hasShownPrompt = localStorage.getItem('hasShownInstallPrompt');
    if (hasShownPrompt) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt = event;
      
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      localStorage.setItem('hasShownInstallPrompt', 'true');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
        localStorage.setItem('hasShownInstallPrompt', 'true');
      }
      deferredPrompt = null;
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('hasShownInstallPrompt', 'true');
  };

  const promptVariants = {
    hidden: { 
      y: 100,
      opacity: 0 
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30 
      }
    },
    exit: { 
      y: 100,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && isMobile && (
        <motion.div
          variants={promptVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-4 left-0 right-0 flex justify-center z-50 px-4"
        >
          <div className="bg-background border border-border rounded-lg shadow-lg p-4 w-full max-w-lg mx-2 flex flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <img src={Logo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
              <div className="text-left">
                <h3 className="text-[13px] sm:text-lg font-semibold text-foreground">Install Our App</h3>
                <p className="text-[11px] sm:text-sm text-muted-foreground">Get the best experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button
                onClick={handleInstallClick}
                className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 w-8 h-8 sm:w-fit sm:h-10 text-[#ffffffbf] border border-[#e6463773] border-dashed  bg-[#e6463736] hover:bg-[#e64637bf]"
                variant="default"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 " />
                <span className='hidden sm:block'>Install</span>
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="icon"
                aria-label="Dismiss install prompt"
                className="w-8 h-8 border sm:w-10 sm:h-10"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;