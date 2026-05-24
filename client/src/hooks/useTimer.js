import { useCallback, useEffect, useState } from "react";

export default function useTimer(initialSeconds = 60) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    if (timeLeft <= 0) {
      setIsRunning(false);
      return undefined;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (next = initialSeconds) => {
      setTimeLeft(next);
      setIsRunning(false);
    },
    [initialSeconds]
  );

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset
  };
}
