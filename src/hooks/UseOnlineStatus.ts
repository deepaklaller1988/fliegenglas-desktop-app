import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAll } from 'utils/audioPlayerIndexedDB';

const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const handleStatusChange = async () => {
      if (navigator.onLine) {
        setIsOnline(true);
        // Redirect or perform any other online-specific logic
      } else {
        setIsOnline(false);
        // Immediately show the offline page
        router.push('/offline');
        
        // Check IndexedDB data in the background
        const hasOfflineData = await checkIndexedDBData();
        if (hasOfflineData) {
          router.push('/settings/downloads'); // Redirect if offline data exists
        }
      }
    };

    const checkIndexedDBData = async (): Promise<boolean> => {
      try {
        const offlineAudios:any = await getAll();
        return offlineAudios.length > 0;
      } catch (error) {
        console.error('IndexedDB Error:', error);
        return false;
      }
    };

    // Initial status check
    handleStatusChange();

    // Add event listeners
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    // Clean up
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [router]);

  return isOnline;
};

export default useOnlineStatus;
