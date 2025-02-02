import {Stack, SplashScreen, Slot} from "expo-router";
import {useCallback, useEffect, useState} from "react";
import * as Font from "expo-font";
import {Inter_400Regular, Inter_600SemiBold, Inter_800ExtraBold} from "@expo-google-fonts/inter";
import {SessionProvider} from "@/app/providers/SessionProvider";
import "./global.css"
import {useSafeAreaInsets} from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    try {
      Font.loadAsync('Inter');
    } catch (e) {
      console.warn(e)
    } finally {
      setAppReady(true);
    }
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
      <SessionProvider>
        <Slot/>
      </SessionProvider>
  )
  // return <Stack/>
}
