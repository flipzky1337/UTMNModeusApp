import {Pressable, Text, View} from "react-native";
import AuthBrowser from "@/app/components/AuthBrowser";
import {useSession} from "@/app/providers/authctx";
import {Agenda, AgendaList, Calendar, CalendarProvider, DateData, ExpandableCalendar} from "react-native-calendars";
import {useCallback, useEffect, useState} from "react";
import {getCalendarEvents} from "@/app/functions/ModeusAPIFunctions";
import {getUserID} from "@/app/functions/JWTFunctions";
import AgendaItem from "@/app/components/AgendaItem";

interface AgendaItemType {
  title: string,
  data: {}[]
}

export default function Index() {
  const {session} = useSession();
  const today = new Date().toISOString().split('T')[0];
  const [agendaItems, setAgendaItems] = useState([] as AgendaItemType[]);

  function getMonthStartEnd(year: number, month: number) {
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

    const formatDate = (date: Date) => date.toISOString().split('.')[0] + 'Z';

    const timeMin = formatDate(start);
    const timeMax = formatDate(end);

    return {timeMin, timeMax};
  }

  const onMonthChange = useCallback(({dateString}: DateData) => {
    const {timeMin, timeMax} = getMonthStartEnd(new Date(dateString).getFullYear(), new Date(dateString).getMonth());
  }, []);

  if (session) { // fetch data on useeffect if session
    const currentUser = getUserID(session);
    useEffect(() => {

      if (currentUser) {
        const {timeMin, timeMax} = getMonthStartEnd(new Date().getFullYear(), new Date().getMonth());
        getCalendarEvents({
          token: session,
          timeMin: timeMin,
          timeMax: timeMax,
          attendeePersonId: [currentUser]
        }).then(r => setAgendaItems(r));
      }
    }, []);
  }

  const renderAgendaItem = useCallback(({item}: any) => {
    return <AgendaItem item={item}/>
  }, []);

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <CalendarProvider date={today} onMonthChange={onMonthChange}>
        <ExpandableCalendar>
          {
            // @ts-ignore fix for defaultProps warning: https://github.com/wix/react-native-calendars/issues/2455
            ExpandableCalendar.defaultProps = undefined
          }
        </ExpandableCalendar>
        <AgendaList sections={agendaItems} renderItem={renderAgendaItem}></AgendaList>

      </CalendarProvider>
    </View>
  );
}
