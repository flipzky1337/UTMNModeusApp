import {useSession} from "@/app/providers/authctx";
import {Redirect, Stack} from "expo-router";

export default function RootLayout() {
    const {session, isLoading} = useSession()

    if (isLoading) {
        return
    }

    if (session) {
        return <Redirect href={'/(app)'} />
    }

    return (
        <Stack>
            <Stack.Screen name={'index'} options={{headerShown: false}}/>
        </Stack>
    )
}