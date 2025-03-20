import {StatusBar} from "expo-status-bar";
import {AppState, Pressable, Text, View} from "react-native";
import {Drawer} from "expo-router/drawer";
import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {useSession} from "@/app/providers/authctx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useEffect, useRef, useState} from "react";
import {checkTokenExpiration} from "@/app/functions/JWTFunctions";
import {AntDesign, Entypo, FontAwesome} from "@expo/vector-icons";
import {Redirect, router} from "expo-router";

export default function RootLayout() {

  const {session, signOut} = useSession();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  

  useEffect(() => {
    if (!session || checkTokenExpiration(session)) { // basic useeffect check yesyes
      signOut();
    }
  }, []);

  useEffect(() => {
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

  if (!session) {
    return <Redirect href={'/(auth)'}/>
  }

  return (
    <>
      <StatusBar style={'dark'}/>
      <Drawer drawerContent={CustomDrawerContext}>
        <Drawer.Screen name={'index'} options={{
          drawerIcon: () => <Entypo name={'calendar'}></Entypo>,
          drawerLabel: () => <Text>Расписание</Text>,
          headerTitle: 'Modeus',
          headerRight: () => <Pressable className={'mr-4'}><AntDesign name={'filter'} size={24}/></Pressable>, // TODO: correct margin & sizing
        }}>
        </Drawer.Screen>
        <Drawer.Screen name={'profile'} options={{
          drawerIcon: () => <FontAwesome  name={'user'}/>,
          drawerLabel: () => <Text>Профиль и оценки</Text>,
          headerTitle: 'Мои оценки'
        }}>

        </Drawer.Screen>
      </Drawer>
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

      <Pressable onPress={signOut} style={{paddingBottom: bottom + 20, paddingLeft: 20}}>
        <Text className={'font-bold text-xl'}>Выйти</Text>
      </Pressable>
    </View>
  )
}