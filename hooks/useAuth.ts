import { View, Text } from 'react-native'
import React, { useEffect, useContext, createContext } from 'react'
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const auth = getAuth();
    

export function useAuth() {
    const [user, setUser] = React.useState<User | null>();

    useEffect(() => {
        const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        })

        return unsubscribeFromAuthStateChanged
    }, [])
}

