import { WebView } from "react-native-webview";
import {Dispatch, SetStateAction} from "react";
import {ToastAndroid, View} from "react-native";
import {WebViewErrorEvent} from "react-native-webview/lib/WebViewTypes";
import {Toast} from "expo-router/build/views/Toast";
import {router} from "expo-router";

const AuthBrowser = ({signInFunction, setShow}: {signInFunction: (token: string) => void, setShow: Dispatch<SetStateAction<boolean>>}) => {
    const authUrl = 'https://utmn.modeus.org';

    const handleNavigationStateChange = (navState: { url: any; }) => {
        const {url} = navState;
        if (url.includes('id_token=')) {
            const token = url.substring(
                url.indexOf('=') + 1,
                url.indexOf('&')
            );

            if (token) {
                signInFunction(token);
                setShow(false);
                console.log('authorized');
            }
        }
    };

    const handleBrowserError = (event: WebViewErrorEvent) => {
        ToastAndroid.show("Произошла ошибка, попробуйте снова", ToastAndroid.SHORT);
        router.replace('/(auth)')
    }

    return (
        <View style={{position: 'absolute', width: '100%', height: '100%'}} >
            <WebView source={{uri: authUrl}} onNavigationStateChange={handleNavigationStateChange} onError={handleBrowserError} />
        </View>
    )

}

export default AuthBrowser;