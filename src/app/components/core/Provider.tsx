'use client'
import { getQueryClient } from "@lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "context/AuthContext";
import { UserProvider } from "context/UserContext";

export default function Provider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    <AuthContextProvider>
                    {children}
                    </AuthContextProvider>
                </UserProvider>
            </QueryClientProvider>
        </>
    )
}