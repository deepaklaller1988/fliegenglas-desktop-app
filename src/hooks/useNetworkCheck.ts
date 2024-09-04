"use client"
import { useEffect, useState } from "react";
import { getServer } from "./getServer";


const useNetworkCheck = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof window !== "undefined" ? navigator.onLine : true);

  const checkNetworkStatus = async () => {
    try {
      // const response = await fetch("/api/network-status");
      const response = await getServer();
      if (response.success) {
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


      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      const intervalId = setInterval(checkNetworkStatus, 3000);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return { isOnline };
};

export default useNetworkCheck;