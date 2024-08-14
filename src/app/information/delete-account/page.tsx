"use client";

import ErrorPopup from '@components/ErrorPopUp';
import useRole from '@hooks/useRole';
import useTitle from '@hooks/useTitle';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AccountDelete() {
  useTitle("Account Delete");
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleLogout = () => {
    setIsPopupVisible(true);
  };

  const confirmLogout = () => {
    sessionStorage.clear();
    window.location.href = '/auth/login';
  };

  const cancelLogout = () => {
    setIsPopupVisible(false);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 w-full">
      <div className="text-center max-w-lg">
        <h1 className="text-lg font-semibold mb-4">Konto bei Fliegenglas löschen</h1>
        <p className="mb-4">
          Klicken Sie hier, um Ihr Profil und
          Kundenkonto bei
          Fliegenglas zu löschen.
        </p>
        <button 
          onClick={handleLogout} 
          className="bg-yellow-600 text-white font-bold py-2 px-4 rounded-full w-full max-w-md mb-4">
          KONTO BEI FLIEGENGLAS LÖSCHEN
        </button>
        <p className="text-sm text-gray-400">
          Sie können sich später jederzeit neu anmelden.
        </p>
      </div>

      {isPopupVisible && (
        <ErrorPopup
          heading="Bestätigung erforderlich"
          message="Sind Sie sicher, dass Sie Ihr Konto bei Fliegenglas löschen möchten?"
          onClose={cancelLogout}
          onSubmit={confirmLogout}
          type="delete"
        />
      )}
    </div>
  );
}
