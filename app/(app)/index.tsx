import { Text, View } from "react-native";
import AuthBrowser from "@/app/components/AuthBrowser";
import {useSession} from "@/app/providers/authctx";

export default function Index() {
    const session = useSession();

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
          <Text>
            {session.session}
          </Text>
      </View>
    );
}
