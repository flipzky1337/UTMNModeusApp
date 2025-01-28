import {StatusBar} from "expo-status-bar";
import {AppState, Pressable, Text, View} from "react-native";
import {Drawer} from "expo-router/drawer";
import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {useSession} from "@/app/providers/authctx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useEffect, useRef, useState} from "react";
import {checkTokenExpiration} from "@/app/functions/JWTFunctions";

export default function RootLayout() {

  const {session, signOut} = useSession();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        if (session) { // it is logged in anyways - user shouldn't be here without session
          if (checkTokenExpiration(session)) { // perform signout on app active if jwt is expired, no alerts - badass.
            signOut();
          }
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <Drawer drawerContent={CustomDrawerContext}>
        <Drawer.Screen name={'index'} options={{
          headerTitle: 'Modeus',
          // headerLeft: () => <Pressable><Ionicons name={'menu-outline'} size={32}/></Pressable>,
          // headerRight: () => <Pressable className={'mr-4'}><AntDesign name={'user'} size={24}/></Pressable>,
        }}>

        </Drawer.Screen>
      </Drawer>
      <StatusBar style={'dark'}/>
    </>
  )

}

function CustomDrawerContext(props: any) {

  const {bottom} = useSafeAreaInsets();

  const {signOut} = useSession()

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}/>
      </DrawerContentScrollView>

      <Pressable onPress={signOut} style={{paddingBottom: bottom+20, paddingLeft: 20}}>
        <Text>Выйти</Text>
      </Pressable>
    </View>
  )
}