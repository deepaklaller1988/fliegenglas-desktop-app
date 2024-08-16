"use client";
import useOnlineStatus from '@hooks/UseOnlineStatus';
import { useEffect } from 'react';
import "./online.css";

export default function InternetStatus() {
  const isOnline = useOnlineStatus();

  const handleRefresh = () => {
    window.location.reload(); 
  };
  console.log(isOnline);

  useEffect(() => {
  }, [isOnline]);

  return (
    <>
      <div className="time_out">
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
