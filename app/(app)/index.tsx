import {Pressable, Text, View} from "react-native";
import AuthBrowser from "@/app/components/AuthBrowser";
import {useSession} from "@/app/providers/authctx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AntDesign, EvilIcons, Feather, Ionicons} from "@expo/vector-icons";
import {AgendaList, Calendar, CalendarProvider, DateData, ExpandableCalendar} from "react-native-calendars";
import {useCallback, useEffect} from "react";
import {getCalendarEvents} from "@/app/functions/ModeusAPIFunctions";
import {getUserID} from "@/app/functions/JWTFunctions";

export default function Index() {
  const {session} = useSession();
  const insets = useSafeAreaInsets();
  const today = new Date().toISOString().split('T')[0];


  function getMonthStartEnd(year: number, month: number) {
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

    const formatDate = (date: Date) => date.toISOString().split('.')[0] + 'Z';

    const timeMin = formatDate(start);
    const timeMax = formatDate(end);

    return { timeMin, timeMax };
  }


  if (session) {
    const currentUser = getUserID(session);
    useEffect(() => {
      if (currentUser) {
        const { timeMin, timeMax } = getMonthStartEnd(new Date().getFullYear(), new Date().getMonth());
        getCalendarEvents({token: session, timeMin: timeMin, timeMax: timeMax, attendeePersonIDs: [currentUser]});
      }
    }, []);
  }

  const onMonthChange = useCallback(({dateString}: DateData) => {
     const { timeMin, timeMax } = getMonthStartEnd(new Date(dateString).getFullYear(), new Date(dateString).getMonth());
  }, []);

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <CalendarProvider date={today} onMonthChange={onMonthChange}>
        <ExpandableCalendar>

        </ExpandableCalendar>

      </CalendarProvider>
    </View>
  );
}
