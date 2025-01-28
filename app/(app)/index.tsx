import {Pressable, Text, View} from "react-native";
import AuthBrowser from "@/app/components/AuthBrowser";
import {useSession} from "@/app/providers/authctx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AntDesign, EvilIcons, Feather, Ionicons} from "@expo/vector-icons";
import {Calendar, CalendarProvider, ExpandableCalendar} from "react-native-calendars";

export default function Index() {
  const session = useSession();
  const insets = useSafeAreaInsets()

  const today = new Date().toISOString().split('T')[0];
  const getCalendarEvents = () => {
    
  }

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <CalendarProvider date={today}>
        <ExpandableCalendar>

        </ExpandableCalendar>

      </CalendarProvider>
    </View>
  );
}
