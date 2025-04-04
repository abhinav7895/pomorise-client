import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const GitHubRepoDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Choose Repository
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <p className="text-sm text-gray-400 mb-2">
            Pomorise is open source! Which repository would you like to explore?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              className="flex-1 border-gray-700 hover:bg-gray-800"
              onClick={() => window.open('https://github.com/abhinav7895/pomorise-client', '_blank')}
            >
              Frontend Repository
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-gray-700 hover:bg-gray-800"
              onClick={() => window.open('https://github.com/abhinav7895/pomorise-backend', '_blank')}
            >
              Backend Repository
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubRepoDialog;