import React, { useState, useEffect } from 'react';
import { Task, useTasks } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface AddTaskProps {
  onCancel: () => void;
  onTaskAdded: () => void;
  taskToEdit?: Task;
}

const AddTask: React.FC<AddTaskProps> = ({ onCancel, onTaskAdded, taskToEdit }) => {
  const { addTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setEstimatedPomodoros(taskToEdit.estimatedPomodoros);
      setNotes(taskToEdit.notes || '');
    } else {
      setTitle('');
      setEstimatedPomodoros(1);
      setNotes('');
    }
  }, [taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        estimatedPomodoros,
        notes: notes || undefined,
      });
      toast.success('Task updated successfully');
    } else {
      addTask(title, estimatedPomodoros, notes || undefined);
    }
    
    onTaskAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          placeholder="What are you working on?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimate">Estimated Pomodoros</Label>
        <Select
          value={estimatedPomodoros.toString()}
          onValueChange={(value) => setEstimatedPomodoros(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select estimate" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} pomodoro{num !== 1 ? 's' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {taskToEdit ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default AddTask;