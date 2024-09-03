import { useEffect, useState } from "react";
import { getAll } from "../utils/audioPlayerIndexedDB";

const useNetworkCheck = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof window !== "undefined" ? navigator.onLine : true);

  
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
      };

      const handleOffline = () => {
        setIsOnline(false);
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

  return { isOnline,  };
};

export default useNetworkCheck;
