import { useState, useEffect } from 'react';

const Timer = ({ onTick, duration = 60 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (onTick) onTick(duration - newTime); // send elapsed time
        if (newTime === 0) {
          clearInterval(interval);
          setIsActive(false);
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, onTick, duration]);

  return (
    <div className="text-lg font-mono">
      ⏱️ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
    </div>
  );
};

export default Timer;