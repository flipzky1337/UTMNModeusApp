import {createContext, useContext} from "react";

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  token?: string | null;
}>({
  signIn: () => null,
  signOut: () => null,
  token: null,
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


