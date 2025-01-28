import {PropsWithChildren, useState} from "react";
import {useStorageState} from "@/app/hooks/useStorageState";
import {AuthContext, useProtectedRoute} from "./authctx";
import AuthBrowser from "@/app/components/AuthBrowser";

export function SessionProvider({children}: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('token');

    useProtectedRoute(session)

    return (
        <AuthContext.Provider
            value={{
                signIn: (token: string) => {
                    setSession(token);
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}