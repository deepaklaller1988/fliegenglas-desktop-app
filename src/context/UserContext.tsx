"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';

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
    const [user, setUser] = useState<any>("");
    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser ,clearUser}}>
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    return useContext(UserContext);
  }