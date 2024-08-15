"use client";
import { useRouter } from 'next/navigation';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';

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

    const router=useRouter()
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = getCookie('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser as string));
            } catch (error) {
                console.error('Error parsing user cookie:', error);
                router.push("/auth/login");
            }
        } else {
            router.push("/auth/login");
        }
    }, [])

    const clearUser = () => {
        setUser(null);
        setCookie('user', '', { maxAge: -1 }); 
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
