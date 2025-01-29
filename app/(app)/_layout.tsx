import {StatusBar} from "expo-status-bar";
import {AppState, Pressable, Text, View} from "react-native";
import {Drawer} from "expo-router/drawer";
import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {useSession} from "@/app/providers/authctx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useEffect, useRef, useState} from "react";
import {checkTokenExpiration} from "@/app/functions/JWTFunctions";
import {AntDesign} from "@expo/vector-icons";

export default function RootLayout() {

  const {session, signOut} = useSession();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {

    if (session && checkTokenExpiration(session)) { // basic useeffect check yesyes
      signOut();
    }

    const subscription = AppState.addEventListener('change', nextAppState => { // signout if expired on each active state
      if (nextAppState === 'active') {
        console.log('window active')
        if (session && checkTokenExpiration(session)) { // it is logged in anyways - user shouldn't be here (app) without session, signout on expiry\
          signOut();
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
          headerRight: () => <Pressable className={'mr-4'}><AntDesign name={'filter'} size={24}/></Pressable>, // TODO: correct margin & sizing
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