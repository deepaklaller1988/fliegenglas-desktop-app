'use client'
import useOnlineStatus from "@hooks/UseOnlineStatus";
// import useNetworkStatus from "@hooks/useNetworkCheck";
import { getQueryClient } from "@lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "context/AuthContext";
import { UserProvider } from "context/UserContext";

export default function Provider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    // useNetworkStatus()
    useOnlineStatus()
    return (
        <>
            <QueryClientProvider client={queryClient}>
                {/* <NetworkProvider> */}
                    <UserProvider>
                        <AuthContextProvider>
                            {children}
                        </AuthContextProvider>
                    </UserProvider>
                {/* </NetworkProvider> */}
            </QueryClientProvider>
        </>
    )
}