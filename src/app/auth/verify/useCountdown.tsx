import { useState, useEffect } from "react";

const useCountdown = (time = 0) => {
  const [countdown, setCountdown] = useState<number>(time);
  const isOver = countdown === 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const restart = (newCountdown: number) => {
    if (countdown === 0) {
      setCountdown(newCountdown);
    }
  };

  return { countdown, isOver, restart };
};

export default useCountdown;
