import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAll } from 'utils/audioPlayerIndexedDB';

interface OfflineContextType {
  isOffline: boolean;
  checkOfflineStatus: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const router = useRouter();

  const checkOfflineStatus = async () => {
    if (!navigator.onLine) {
      setIsOffline(true);
      const hasOfflineData = await getAll();
      router.push(hasOfflineData ? '/settings/downloads' : '/offline');
    } else {
      setIsOffline(false);
      router.push('/'); // Redirect to home or other page
    }
  };

  useEffect(() => {
    checkOfflineStatus();
    window.addEventListener('online', checkOfflineStatus);
    window.addEventListener('offline', checkOfflineStatus);

    return () => {
      window.removeEventListener('online', checkOfflineStatus);
      window.removeEventListener('offline', checkOfflineStatus);
    };
  }, [router]);

  return (
    <OfflineContext.Provider value={{ isOffline, checkOfflineStatus }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
