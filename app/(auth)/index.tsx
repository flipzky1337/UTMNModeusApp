import {useSession} from "@/app/providers/authctx";
import {Pressable, View, Text, Button} from "react-native";
import AuthBrowser from "@/app/components/AuthBrowser";
import {useContext, useState} from "react";

export default function Auth() {
    const {signIn} = useSession()
    const [showBrowser, setShowBrowser] = useState(false);

    return (
        <View style={{height: '100%', width: '100%'}}>
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