import {createContext, useContext, useEffect, useState} from "react";
import {useRootNavigationState, useRouter, useSegments, Redirect} from "expo-router";
import {setState} from "jest-circus";

export const AuthContext = createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
})

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function useProtectedRoute(session: string | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)"

    if (!session && !inAuthGroup) {
      setTimeout(()=>{router.replace("/(auth)")});
    } else if (session && inAuthGroup) {
      setTimeout(()=>{router.replace("/(app)")});
    }
  }, [session, segments])

}


