import { useEffect, useState } from "react";

const useNetworkCheck = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const checkNetworkStatus = async () => {
    try {
      const response = await fetch("https://www.google.com", { mode: "no-cors" });
      if (response) {
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
      setIsOnline(navigator.onLine);

      checkNetworkStatus();
      const intervalId = setInterval(checkNetworkStatus, 1000);

      return () => clearInterval(intervalId);
    }
  }, []);

  return { isOnline };
};

export default useNetworkCheck;
