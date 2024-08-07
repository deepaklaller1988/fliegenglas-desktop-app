"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    nick_name: string;
    user_avatar: string;
    token: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const type = typeof window !== "undefined"
    useEffect(() => {
        if (type) {
            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const clearUser = () => {
        setUser(null);
        if (type) {
            sessionStorage.removeItem("user");
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
