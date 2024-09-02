"use client";

import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useAudioPlayer } from "context/AudioPlayerContext";
import { useEffect } from "react";

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

  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     const registerServiceWorker = async () => {
  //       try {
  //         const swUrl = `/service-worker.js`;
  //         const registration = await navigator.serviceWorker.register(swUrl);
  //         console.log(
  //           "Service Worker registered with scope:",
  //           registration.scope
  //         );
  //       } catch (error) {
  //         console.error("Service Worker registration failed:", error);
  //       }
  //     };

  //     registerServiceWorker();
  //   }
  // }, []);

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
