"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAll } from 'utils/audioPlayerIndexedDB';

const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOnline, setWasOnline] = useState<boolean>(navigator.onLine);
  const router = useRouter();

  const checkIndexedDBData = async (): Promise<boolean> => {
    try {
      const offlineAudios: any = await getAll();
      console.log('IndexedDB Data:', offlineAudios);
      return offlineAudios.length > 0;
    } catch (error) {
      console.error('IndexedDB Error:', error);
      return false;
    }
  };

  useEffect(() => {
    const updateOnlineStatus = async () => {
      console.log('Updating online status...');
      const onlineStatus = navigator.onLine;
      console.log(`Online status: ${onlineStatus}, Previous: ${wasOnline}`);
      
      if (onlineStatus !== wasOnline) {
        setIsOnline(onlineStatus);
        setWasOnline(onlineStatus);

        if (onlineStatus) {
          console.log('Online, navigating back...');
          router.back();
        } else {
          console.log('Offline, checking IndexedDB...');
          const hasOfflineData = await checkIndexedDBData();
          if (hasOfflineData) {
            console.log('Has offline data, navigating to downloads...');
            router.push('/settings/downloads');
          } else {
            console.log('No offline data, navigating to internet status...');
            router.push('/internetStatus');
          }
        }
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial check
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [router, wasOnline]);

  return isOnline;
};

export default useOnlineStatus;
