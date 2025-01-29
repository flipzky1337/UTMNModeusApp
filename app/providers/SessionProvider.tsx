import {PropsWithChildren} from "react";
import {useStorageState} from "@/app/hooks/useStorageState";
import {AuthContext, useProtectedRoute} from "./authctx";
import {useRouter} from "expo-router";

export function SessionProvider({children}: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('token');
  const router = useRouter();

  useProtectedRoute(session)

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => {
          setSession(token);
        },
        signOut: () => {
          router.replace("/(auth)")
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}