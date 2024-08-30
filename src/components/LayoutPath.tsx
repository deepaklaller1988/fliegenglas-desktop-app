"use client";

import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useAudioPlayer } from "context/AudioPlayerContext";

const LayoutPath = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const route = path.split("/");
  const { closePlayer } = useAudioPlayer();
  const storedUser = getCookie("user");
  if (!storedUser) {
    closePlayer();
  }

  // Determine if the current route is a dashboard route
  const isDashboard = () => {
    return !route.includes("auth") && !route.includes("offline")
      ? !route.includes("maintenance")
        ? true
        : false
      : false;
  };



  return (
    <div className="flex w-full">
      {isDashboard() ? (
        <>
          <Sidebar />
          {children}
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default LayoutPath;
