import {createContext, useContext, useEffect} from "react";
import {useRouter, useSegments} from "expo-router";

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
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)"

    if (!session && !inAuthGroup) {

      router.replace("/(auth)")

    } else if (session && inAuthGroup) {

      router.replace("/(app)")

    }
  }, [session, segments])
}


