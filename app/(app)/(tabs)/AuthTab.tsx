import {useState} from "react";
import {Button, View} from "react-native";
import AuthBrowser from "@/app/components/AuthBrowser";

const AuthTab = () => {
  const [auth, setAuth] = useState(false);

  return (
      <View style={{flex: 1, width: '100%'}}>
          <Button title={'Авторизация'} onPress={() => setAuth(true)}/>
          <AuthBrowser showWebView={auth} setShowWebView={setAuth}/>
      </View>
  );
}

export default AuthTab;