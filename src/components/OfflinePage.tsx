import useNetworkCheck from '@hooks/useNetworkCheck';
import React from 'react'

export default function OfflinePage() {
    const { isOnline } = useNetworkCheck();

    const handleRefresh =async () => {
            if (isOnline) {
                window.location.reload();
        };    };
    return (
        <div className="flex items-center justify-center h-screen px-5">
            <div className="text-center text-white max-w-xs flex flex-col gap-5 items-center inline-block">
                <span>
                    <img src="/assets/images/wifi.svg" alt="wifi-disabled" />
                </span>
                <p>Du bist offline oder die Netzwerkverbindung ist schwach.</p>
                <button className="bg-[#ff9900] text-white p-2 w-full rounded-md" onClick={handleRefresh}>

                    Jetzt neu verbinden
                </button>
            </div>
        </div>
    )
}
