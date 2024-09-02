'use client'
import useNetworkCheck from "@hooks/useNetworkCheck";
import { getQueryClient } from "@lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "context/AuthContext";
import { UserProvider } from "context/UserContext";
import OfflinePage from "../../components/OfflinePage";

export default function Provider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    const {isOnline}= useNetworkCheck();

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