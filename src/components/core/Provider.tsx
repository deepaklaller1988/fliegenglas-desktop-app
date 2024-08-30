'use client'
import useOnlineStatus from "@hooks/UseOnlineStatus";
import { getQueryClient } from "@lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "context/AuthContext";
import { OfflineProvider } from "context/InternetContext";
import { UserProvider } from "context/UserContext";

export default function Provider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    useOnlineStatus();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <OfflineProvider>
                    <UserProvider>
                        <AuthContextProvider>
                            {children}
                        </AuthContextProvider>
                    </UserProvider>
                </OfflineProvider>
            </QueryClientProvider>
        </>
    )
}