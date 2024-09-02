import { useEffect, useState } from "react";
import { getAll } from "../utils/audioPlayerIndexedDB";

const useNetworkCheck = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof window !== "undefined" ? navigator.onLine : true);
  const [hasCachedData, setHasCachedData] = useState<boolean>(false);

  const checkIndexedDBData = async () => {
    try {
      console.log("Fetching data from IndexedDB...");
      const offlineAudios: any = await getAll();
      console.log("Fetched offline audios:", offlineAudios);
      setHasCachedData(offlineAudios.length > 0);
    } catch (error) {
      console.error('IndexedDB Error:', error);
      setHasCachedData(false);
    }
  };
  
  const checkNetworkStatus = async () => {
    try {
      const response = await fetch("https://www.google.com", { mode: "no-cors" });
      if (response.ok) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleOnline = () => {
        setIsOnline(true);
        checkIndexedDBData(); // Check IndexedDB when coming online
      };

      const handleOffline = () => {
        setIsOnline(false);
        checkIndexedDBData(); // Check IndexedDB when going offline
      };

      checkNetworkStatus(); // Initial network check

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      const intervalId = setInterval(checkNetworkStatus, 1000);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  console.log("Network status:", isOnline);
  console.log("Has cached data:", hasCachedData);

  return { isOnline, hasCachedData };
};

export default useNetworkCheck;
