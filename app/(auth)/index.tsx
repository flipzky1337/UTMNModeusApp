import {useSession} from "@/app/providers/authctx";
import {Pressable, View, Text, Button} from "react-native";
import AuthBrowser from "@/app/components/AuthBrowser";
import {useContext, useState} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function Auth() {
    const {signIn} = useSession()
    const {top} = useSafeAreaInsets();
    const [showBrowser, setShowBrowser] = useState(false);

    return (
        <View className={'flex'} style={{height: '100%', width: '100%', alignItems:'center', justifyContent:'center', marginTop: top}}>
            {/*<Pressable onPress={() => {setShowBrowser(true);}}>*/}
            {/*    <Text>*/}
            {/*        Авторизоваться*/}
            {/*    </Text>*/}
            {/*</Pressable>*/}
            <Button title={'Авторизоваться'} onPress={() => {setShowBrowser(true);}}/>
            {showBrowser && <AuthBrowser signInFunction={signIn} setShow={setShowBrowser}/>}
        </View>
    )
}