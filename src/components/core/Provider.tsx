"use client";
import useNetworkCheck from "@hooks/useNetworkCheck";
import { getQueryClient } from "@lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "context/AuthContext";
import { UserProvider } from "context/UserContext";
import OfflinePage from "../../components/OfflinePage";
import { useEffect, useState } from "react";
import { getAll } from "../../utils/audioPlayerIndexedDB";
import DownloadCompo from "@components/DownloadCompo";
import { AudioPlayerProvider } from "context/AudioPlayerContext";
import FliegenglasAudioPlayer from "@components/FliegenglasAudioPlayer";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const { isOnline } = useNetworkCheck();
  const [offlineData, setOfflineData] = useState([]);
  const [cookie, setCookie] = useState<any>();

  const router = useRouter();

  useEffect(() => {
    checkIndexedDBData();
    const storedUser = getCookie("user");
    setCookie(storedUser);
    // if (!isOnline) {
    //   // router.push("/settings/downloads");
    // } else {
    //   // router.push("/home");
    // }
  }, [isOnline]);

  const checkIndexedDBData = async () => {
    try {
      console.log("Fetching data from IndexedDB...");
      const offlineAudios: any = await getAll();
      console.log("Fetched offline audios:", offlineAudios);
      setOfflineData(offlineAudios);
    } catch (error) {
      console.error("IndexedDB Error:", error);
    }
  };

  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch((error) => {
            console.log("Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <AuthContextProvider>
            <AudioPlayerProvider>
              {isOnline ? (
                children
              ) : cookie ? (
                offlineData.length > 0 ? (
                  <>
                    <FliegenglasAudioPlayer />
                    <DownloadCompo />
                  </>
                ) : (
                  <OfflinePage />
                )
              ) : (
                <OfflinePage />
              )}
            </AudioPlayerProvider>
          </AuthContextProvider>
        </UserProvider>
      </QueryClientProvider>
    </>
  );
}
