"use client";
import { useEffect } from 'react';
import "./offline.css";
import { useOffline } from 'context/InternetContext';

export default function InternetStatus() {
const {isOffline}=useOffline()

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
