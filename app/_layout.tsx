import {Stack, SplashScreen} from "expo-router";
import {useCallback, useEffect, useState} from "react";
import * as Font from "expo-font";
import {Inter_400Regular, Inter_600SemiBold, Inter_800ExtraBold} from "@expo-google-fonts/inter";

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
      <Stack>
        <Stack.Screen name={'(tabs)'} options={{headerShown: false}}/>
      </Stack>
  )
  // return <Stack/>
}
