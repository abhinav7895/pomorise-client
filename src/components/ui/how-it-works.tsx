import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, Coffee, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HowItWorksModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setTimeout(() => {
      if (step < steps.length - 1) {
        setStep(step + 1);
      } else {
        const resetTimer = setTimeout(() => {
          setStep(0);
        }, 3000);
        return () => clearTimeout(resetTimer);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [step, isOpen]);

  const steps = [
    {
      title: "Focus Time",
      description: "Work on tasks for 25 minutes with full concentration",
      icon: <Clock className="text-primary w-12 h-12" />,
      animation: (
        <motion.div 
          className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ 
            scale: [0.8, 1, 0.8], 
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Clock className="text-primary w-10 h-10" />
        </motion.div>
      )
    },
    {
      title: "Complete Tasks",
      description: "Check off tasks as you accomplish them using our task manager",
      icon: <CheckCircle className="text-green-500 w-12 h-12" />,
      animation: (
        <motion.div className="flex flex-col items-center space-y-2">
          <motion.div 
            className="h-6 w-32 bg-gray-700 rounded-md flex items-center px-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="h-4 w-4 mr-2 rounded-sm border border-gray-500"
            />
            <motion.div className="h-3 w-16 bg-gray-600 rounded-sm" />
          </motion.div>
          
          <motion.div 
            className="h-6 w-32 bg-gray-700 rounded-md flex items-center px-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="h-4 w-4 mr-2 rounded-sm border border-gray-500 flex items-center justify-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4 }}
                className="h-2 w-2 bg-green-500 rounded-sm"
              />
            </motion.div>
            <motion.div className="h-3 w-16 bg-gray-600 rounded-sm" />
          </motion.div>
        </motion.div>
      )
    },
    {
      title: "Take Breaks",
      description: "Enjoy short 5-minute breaks between pomodoros and longer 15-30 minute breaks after 4 pomodoros",
      icon: <Coffee className="text-amber-500 w-12 h-12" />,
      animation: (
        <motion.div className="relative">
          <motion.div 
            className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center"
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Coffee className="text-amber-500 w-8 h-8" />
          </motion.div>
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-amber-500/30 rounded-full"
            initial={{ scale: 0.6, opacity: 0.3 }}
            animate={{ scale: [0.6, 1, 0.6], opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      )
    },
    {
      title: "Track Progress",
      description: "See your productivity stats and improve your workflow with AI-powered insights",
      icon: <BarChart className="text-blue-500 w-12 h-12" />,
      animation: (
        <motion.div className="flex items-end space-x-2 h-20">
          {[0.3, 0.5, 0.7, 0.9, 0.6, 0.8].map((height, i) => (
            <motion.div
              key={i}
              className="w-4 bg-blue-500/80 rounded-t-sm"
              initial={{ height: 0 }}
              animate={{ height: `${height * 100}%` }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.15,
                ease: "backOut"
              }}
            />
          ))}
        </motion.div>
      )
    },
  ];

  const currentStep = steps[step];

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: { 
      width: "100%",
      transition: { 
        duration: 3,
        ease: "linear"
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          <motion.div
            className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">How Pomorise Works</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex justify-between mb-6">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 flex-1 ${i === step ? 'bg-primary' : 'bg-gray-700'} ${i > 0 ? 'ml-1' : ''}`}
                  >
                    {i === step && (
                      <motion.div
                        className="h-full bg-primary/50"
                        variants={progressVariants}
                        initial="initial"
                        animate="animate"
                        key={step}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-6 h-32 flex items-center justify-center">
                  {currentStep.animation}
                </div>
                <h3 className="text-xl font-semibold mb-2">{currentStep.title}</h3>
                <p className="text-gray-400 mb-8">{currentStep.description}</p>
              </div>
            </div>
            
            <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setStep(prev => Math.max(0, prev - 1))}
                disabled={step === 0}
                className="border-gray-700"
              >
                Previous
              </Button>
              <Button 
                onClick={() => {
                  if (step < steps.length - 1) {
                    setStep(step + 1);
                  } else {
                    setStep(0);
                  }
                }}
              >
                {step < steps.length - 1 ? "Next" : "Restart"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HowItWorksModal;