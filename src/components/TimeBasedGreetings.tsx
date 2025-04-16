import { useState, useEffect } from 'react';

const TimeBasedGreeting = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getRandomGreeting = (greetings) => {
      const randomIndex = Math.floor(Math.random() * greetings.length);
      return greetings[randomIndex];
    };

    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      
      // morning greetings 5 AM - 11:59 AM
      const morningGreetings = [
        "Rise and shine",
        "Good morning",
        "Coffee time?",
        "Hello, sunshine",
        "Morning vibes",
        "Fresh start",
        "Rise & conquer",
        "Early bird wins"
      ];
      
      // afternoon greetings 12 PM - 4:59 PM
      const afternoonGreetings = [
        "Good afternoon",
        "Halfway there",
        "Keep it going",
        "Afternoon energy",
        "Productivity peak",
        "Power through",
        "Afternoon boost",
        "Hello there"
      ];
      
      // evening greetings 5 PM - 8:59 PM
      const eveningGreetings = [
        "Good evening",
        "Winding down?",
        "Evening focus",
        "Final stretch",
        "Evening momentum",
        "Steady pace",
        "Almost there",
        "Evening excellence"
      ];
      
      // night greetings 9 PM - 4:59 AM
      const nightGreetings = [
        "Working late?",
        "Night owl mode",
        "Midnight focus",
        "Night session",
        "Stars & focus",
        "Night productivity",
        "Quiet focus time",
        "Night thoughts"
      ];
      
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting(getRandomGreeting(morningGreetings));
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting(getRandomGreeting(afternoonGreetings));
      } else if (currentHour >= 17 && currentHour < 21) {
        setGreeting(getRandomGreeting(eveningGreetings));
      } else {
        setGreeting(getRandomGreeting(nightGreetings));
      }
    };
    

    updateGreeting();
    
    const intervalId = setInterval(updateGreeting, 3600000); 
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full font-grotesk text-gray-600 text-left sm:py-2 text-3xl md:text-4xl lg:text-5xl font-medium">
      {greeting}
    </div>
  );
};

export default TimeBasedGreeting;