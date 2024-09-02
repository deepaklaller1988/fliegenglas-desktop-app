'use client'
import useNetworkCheck from "@hooks/useNetworkCheck";
import { getQueryClient } from "@lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "context/AuthContext";
import { UserProvider } from "context/UserContext";
import OfflinePage from "../../components/OfflinePage";
import { useEffect } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    const {isOnline,hasCachedData }= useNetworkCheck();
console.log(hasCachedData,"hasCachedData")
    useEffect(() => {
        if ("serviceWorker" in navigator) {
          const registerServiceWorker = async () => {
            try {
              const swUrl = `/service-worker.js`;
              const registration = await navigator.serviceWorker.register(swUrl);
              console.log(
                "Service Worker registered with scope:",
                registration.scope
              );
            } catch (error) {
              console.error("Service Worker registration failed:", error);
            }
          };
    
          registerServiceWorker();
        }
      }, [])

    return (
        <>
            <QueryClientProvider client={queryClient}>
                    <UserProvider>
                        <AuthContextProvider>
                        {isOnline ?  children   : <OfflinePage />}
                        </AuthContextProvider>
                    </UserProvider>
            </QueryClientProvider>
        </>
    )
}