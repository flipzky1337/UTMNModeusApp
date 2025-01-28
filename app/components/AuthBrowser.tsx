import { WebView } from "react-native-webview";
import {Dispatch, SetStateAction} from "react";
import {View} from "react-native";

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

    return (
        <View style={{position: 'absolute', width: '100%', height: '100%'}} >
                <WebView source={{uri: authUrl}} onNavigationStateChange={handleNavigationStateChange}/>
        </View>
    )

}

export default AuthBrowser;