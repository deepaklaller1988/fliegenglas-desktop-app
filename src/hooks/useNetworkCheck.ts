import { useEffect, useState } from "react";

const useNetworkStatus = () => {
  const [isOnline, setOnline] = useState<boolean>(true);

  const updateNetworkStatus = () => {
    if (typeof window !== "undefined") {
      setOnline(navigator.onLine);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      updateNetworkStatus();

      window.addEventListener("load", updateNetworkStatus);
      window.addEventListener("online", updateNetworkStatus);
      window.addEventListener("offline", updateNetworkStatus);

      return () => {
        window.removeEventListener("load", updateNetworkStatus);
        window.removeEventListener("online", updateNetworkStatus);
        window.removeEventListener("offline", updateNetworkStatus);
      };
    }
  }, []);

  return { isOnline };
};

export default useNetworkStatus;
