import { useEffect, useState } from "react";

const useNetworkCheck = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof window !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      // Update online status based on navigator.onLine
      const updateOnlineStatus = () => setIsOnline(navigator.onLine);

      // Check initial network status
      updateOnlineStatus();

      // Add event listeners for online and offline events
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Periodic check to update online status
      const intervalId = setInterval(updateOnlineStatus, 1000);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  console.log("Network status:", isOnline);

  return { isOnline };
};

export default useNetworkCheck;
