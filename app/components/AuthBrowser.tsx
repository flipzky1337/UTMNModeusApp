import { WebView } from "react-native-webview";
import {useState} from "react";
import {Button, View} from "react-native";
import * as SecureStore from "expo-secure-store";

const AuthBrowser = ({showWebView, setShowWebView}) => {
    const authUrl = 'https://utmn.modeus.org';
    
    const handleNavigationStateChange = (navState: { url: any; }) => {
        const {url} = navState;
        if (url.includes('id_token=')) {
            const token = url.substring(
                url.indexOf('=') + 1,
                url.indexOf('&')
            );

            if (token) {
                SecureStore.setItem('modeus_token', token)
                console.log(SecureStore.getItem('modeus_token'))
                setShowWebView(false);
            }
        }
    };

    return (
        <View style={{flex: 1, width: '100%'}} >
            {
                showWebView &&
                (<WebView source={{uri: authUrl}} onNavigationStateChange={handleNavigationStateChange} incognito={true}>

                </WebView>)
            }
        </View>
    )

}

export default AuthBrowser;