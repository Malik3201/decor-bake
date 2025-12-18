import { useState, useEffect, memo } from 'react';

export const CountdownTimer = memo(({ endDate, onComplete, compact = false, dark = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endDate, onComplete]);

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <span className={`font-semibold ${dark ? 'text-red-400' : 'text-red-500'}`}>
        Expired
      </span>
    );
  }

  // Compact version for smaller spaces
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {timeLeft.days > 0 && (
          <>
            <TimeBox value={timeLeft.days} label="D" compact dark={dark} />
            <Separator dark={dark} />
          </>
        )}
        <TimeBox value={timeLeft.hours} label="H" compact dark={dark} />
        <Separator dark={dark} />
        <TimeBox value={timeLeft.minutes} label="M" compact dark={dark} />
        <Separator dark={dark} />
        <TimeBox value={timeLeft.seconds} label="S" compact dark={dark} animate />
      </div>
    );
  }

  // Full version
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {timeLeft.days > 0 && (
        <TimeBox value={timeLeft.days} label="Days" dark={dark} />
      )}
      <TimeBox value={timeLeft.hours} label="Hours" dark={dark} />
      <TimeBox value={timeLeft.minutes} label="Mins" dark={dark} />
      <TimeBox value={timeLeft.seconds} label="Secs" dark={dark} animate />
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

// Time Box Component
const TimeBox = memo(({ value, label, compact = false, dark = false, animate = false }) => {
  const baseClasses = compact
    ? 'countdown-box py-1 px-2 min-w-[40px]'
    : 'countdown-box';
  
  const bgClasses = dark
    ? 'bg-white/20 backdrop-blur-sm'
    : 'bg-white';
  
  const valueClasses = compact
    ? `text-base font-bold ${dark ? 'text-white' : 'text-pink-600'}`
    : `countdown-value ${dark ? 'text-white' : ''}`;
  
  const labelClasses = compact
    ? `text-[10px] ${dark ? 'text-white/70' : 'text-gray-500'}`
    : `countdown-label ${dark ? 'text-white/70' : ''}`;

  return (
    <div className={`${baseClasses} ${bgClasses} ${animate ? 'animate-pulse-slow' : ''}`}>
      <span className={valueClasses}>
        {String(value).padStart(2, '0')}
      </span>
    </div>
  );
});

TimeBox.displayName = 'TimeBox';

// Separator Component
const Separator = memo(({ dark = false }) => (
  <span className={`text-lg font-bold ${dark ? 'text-white/50' : 'text-pink-300'}`}>
    :
  </span>
));

Separator.displayName = 'Separator';
