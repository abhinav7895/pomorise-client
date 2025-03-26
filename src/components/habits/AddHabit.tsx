
import React, { useState } from 'react';
import { useHabits } from '@/context/HabitContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PlusCircle, MinusCircle, Check, X, HelpCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const habitColors = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'violet', label: 'Violet', class: 'bg-violet-500' },
  { value: 'slate', label: 'Slate', class: 'bg-slate-500' },
  { value: 'zinc', label: 'Zinc', class: 'bg-zinc-500' },
];

interface AddHabitProps {
  onCancel: () => void;
  onHabitAdded: () => void;
}

const AddHabit: React.FC<AddHabitProps> = ({ onCancel, onHabitAdded }) => {
  const { addHabit, getHabitsToStack } = useHabits();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPositive, setIsPositive] = useState(true);
  const [targetDays, setTargetDays] = useState(21);
  const [reminderTime, setReminderTime] = useState<string | null>(null);
  const [stackedWith, setStackedWith] = useState<string | null>(null);
  const [color, setColor] = useState('blue');
  
  const habitsToStack = getHabitsToStack();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    addHabit({
      name: name.trim(),
      description: description.trim(),
      isPositive,
      targetDays,
      reminderTime,
      stackedWith,
      color,
    });
    
    onHabitAdded();
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="habitType" className="mb-2 block">I want to:</Label>
          <RadioGroup 
            defaultValue={isPositive ? "build" : "break"} 
            onValueChange={(val) => setIsPositive(val === "build")}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="build" id="build" />
              <Label htmlFor="build" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-blue-500" />
                Build a habit
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="break" id="break" />
              <Label htmlFor="break" className="flex items-center gap-2">
                <MinusCircle className="h-4 w-4 text-rose-500" />
                Break a habit
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="name" className="mb-2 block">Habit Name*</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isPositive ? "e.g., Morning meditation" : "e.g., Checking social media"}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="mb-2 block">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why this habit is important to you..."
            rows={3}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="targetDays">Target Days</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">Research suggests it takes around 21-66 days to form a habit, depending on its complexity. 21 days is a good starting point.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={targetDays.toString()}
            onValueChange={(value) => setTargetDays(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="21 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days (1 week)</SelectItem>
              <SelectItem value="14">14 days (2 weeks)</SelectItem>
              <SelectItem value="21">21 days (3 weeks)</SelectItem>
              <SelectItem value="30">30 days (1 month)</SelectItem>
              <SelectItem value="60">60 days (2 months)</SelectItem>
              <SelectItem value="90">90 days (3 months)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="reminderTime">Daily Reminder</Label>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="reminderTime"
            type="time"
            value={reminderTime || ""}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
        
        {habitsToStack.length > 0 && (
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="stackedWith">Stack With</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Habit stacking: Link a new habit with an established one to make it easier to remember and perform. Only shows habits with at least 3 days of consistency.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={stackedWith || ""}
              onValueChange={(value) => setStackedWith(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an established habit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {habitsToStack.map(habit => (
                  <SelectItem key={habit.id} value={habit.id}>{habit.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div>
          <Label className="mb-2 block">Color</Label>
          <div className="flex gap-2 flex-wrap">
            {habitColors.map(c => (
              <button
                key={c.value}
                type="button"
                className={`w-8 h-8 rounded-full ${c.class} ${color === c.value ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                onClick={() => setColor(c.value)}
                aria-label={`Select ${c.label} color`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            Save Habit
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddHabit;
