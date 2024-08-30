"use client";
import { useEffect } from 'react';
import "./online.css";
// import useNetworkStatus from '@hooks/useNetworkCheck';
// import useOnlineStatus from '@hooks/UseOnlineStatus';

export default function InternetStatus() {
  // const {isOnline}  :any= useOnlineStatus();

  // useEffect(() => {
  //   console.log('Network status:', isOnline);
  // }, [isOnline]);

  const handleRefresh = () => {
    window.location.reload(); 
  };

  // useEffect(() => {
  // }, [isOnline]);

  return (
    <>
      <div className="time_out w-full">
        <div className="wifi-section">
          <span>
            <img src="/assets/images/wifi.svg" alt="wifi-disabled" />
          </span>
          <p>Du bist offline oder die Netzwerkverbindung ist schwach.</p>
          <button className="buy-btn" onClick={handleRefresh}>
            Jetzt neu verbinden
          </button>
        </div>
      </div>
    </>
  );
}
