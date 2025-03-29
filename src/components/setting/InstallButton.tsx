// src/components/InstallPrompt.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '/logo.svg'; // Adjust path if needed
import { useIsMobile } from '@/hooks/use-mobile';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }
    
    // Check if prompt has been shown before in this session
    const hasShownPrompt = localStorage.getItem('hasShownInstallPrompt');
    if (hasShownPrompt === 'true') return;

    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      event.preventDefault();
      
      // Store the event for later use
      const promptEvent = event as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      
      // Show the prompt UI
      setShowPrompt(true);
      
      console.log('Install prompt captured and ready');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide prompt if app is installed
    window.addEventListener('appinstalled', () => {
      console.log('App was installed');
      setShowPrompt(false);
      localStorage.setItem('hasShownInstallPrompt', 'true');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('Install button clicked, prompt available:', !!installPrompt);
    
    if (installPrompt) {
      try {
        // Show the prompt
        await installPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const choiceResult = await installPrompt.userChoice;
        
        console.log('User installation choice:', choiceResult.outcome);
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setShowPrompt(false);
        } else {
          console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt as it can only be used once
        setInstallPrompt(null);
      } catch (error) {
        console.error('Error during installation process:', error);
      }
    } else {
      console.warn('Install prompt not available');
      
      // For iOS devices that don't support the beforeinstallprompt event
      if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
        alert('To install this app on your iOS device: tap the share button and then "Add to Home Screen"');
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // We'll set a session marker but not a permanent one
    // This way the prompt can appear again next time
    sessionStorage.setItem('hasShownInstallPrompt', 'true');
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
      {showPrompt && (
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
                className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 w-8 h-8 sm:w-fit sm:h-10 text-[#ffffffbf] border border-[#e6463773] border-dashed bg-[#e6463736] hover:bg-[#e64637bf]"
                variant="default"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
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