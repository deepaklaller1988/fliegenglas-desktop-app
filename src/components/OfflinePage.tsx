"use client";

// import useNetworkCheck from "@hooks/useNetworkCheck";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useNetwork } from "context/NetworkContext";

export default function OfflinePage() {
  // const { isOnline } = useNetworkCheck();
  const { isOnline } = useNetwork();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  const handleRefresh = async () => {
    if (isOnline) {
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen px-5">
        <div className="text-center text-white max-w-xs flex flex-col gap-5 items-center inline-block">
          <span>
            <Image
              src="/wifi.svg"
              alt="wifi-disabled"
              width={100}
              height={100}
              loading="lazy"
            />
          </span>
          <p>Du bist offline oder die Netzwerkverbindung ist schwach.</p>
          <button
            className="bg-[#ff9900] text-white p-2 w-full rounded-md"
            onClick={handleRefresh}
          >
            Jetzt neu verbinden
          </button>
        </div>
      </div>
    );
  } else {
    <p>OFFLINE</p>;
  }
}
