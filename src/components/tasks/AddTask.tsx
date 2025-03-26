
import React, { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { XCircle, PlusCircle } from 'lucide-react';

interface AddTaskProps {
  onCancel: () => void;
  onTaskAdded: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onCancel, onTaskAdded }) => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() === '') return;
    
    addTask(title, estimatedPomodoros, notes);
    setTitle('');
    setEstimatedPomodoros(1);
    setNotes('');
    onTaskAdded();
  };

  const incrementPomodoros = () => {
    setEstimatedPomodoros(prev => Math.min(prev + 1, 10));
  };

  const decrementPomodoros = () => {
    setEstimatedPomodoros(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="p-3 border border-border rounded-lg bg-card/80 backdrop-blur-sm animate-scale-in">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task name"
          className="text-sm"
          autoFocus
        />
        
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">
              Pomodoros
            </label>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={decrementPomodoros}
                disabled={estimatedPomodoros <= 1}
              >
                -
              </Button>
              <Input
                type="number"
                min="1"
                max="10"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
                className="w-10  h-7 mx-1 text-center text-xs px-0"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={incrementPomodoros}
                disabled={estimatedPomodoros >= 10}
              >
                +
              </Button>
            </div>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowNotes(!showNotes)}
            className="text-xs h-7"
          >
            {showNotes ? "Hide" : "Notes"}
          </Button>
        </div>
        
        {showNotes && (
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            className="resize-none text-sm"
            rows={2}
          />
        )}
        
        <div className="flex justify-end gap-1 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 text-xs"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Cancel
          </Button>
          <Button type="submit" size="sm" className="h-8 text-xs">
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
