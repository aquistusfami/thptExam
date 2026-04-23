import { useEffect } from 'react';
import { useQuizStore } from '@/store/useQuizStore';

export function useQuizTimer(onExpire: () => void) {
  const { timeLeft, setTimeLeft } = useQuizStore();

  useEffect(() => {
    // End quiz if time is up
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, setTimeLeft, onExpire]);

  // Anti-cheat: Visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && timeLeft > 0) {
        alert("CẢNH BÁO: Rời khỏi màn hình thi là vi phạm quy chế! Hành vi này đã được ghi nhận.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [timeLeft]);

  return { timeLeft };
}
