"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [wasOnline, setWasOnline] = useState<boolean>(true); 

  const router = useRouter();

  useEffect(() => {
    const updateOnlineStatus = () => {
      const onlineStatus = navigator.onLine;
      setIsOnline(onlineStatus);

      if (onlineStatus) {
        if (!wasOnline) {
          router.back();
        }
      } else {
        router.push('/internetStatus');
      }
      setWasOnline(onlineStatus);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [router, wasOnline]);

  return isOnline;
};

export default useOnlineStatus;
