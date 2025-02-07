import {View} from "react-native";
import {useSession} from "@/app/providers/authctx";
import {AgendaList, CalendarProvider, DateData, ExpandableCalendar} from "react-native-calendars";
import {Suspense, useCallback, useEffect, useState} from "react";
import {getCalendarEvents} from "@/app/functions/ModeusAPIFunctions";
import {getUserID} from "@/app/functions/JWTFunctions";
import AgendaItem from "@/app/components/AgendaItem";
import {MarkedDates} from "react-native-calendars/src/types";
import {LocaleConfig} from "react-native-calendars";
import {eventTypes} from "@/app/types/ModeusAPITypes";

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ],
  monthNamesShort: [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ],
  dayNames: [
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
  ],
  dayNamesShort: [
    'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'
  ],
  today: 'Сегодня'
};

LocaleConfig.defaultLocale = 'ru';

interface AgendaItemType {
  title: string,
  data: {}[]
}

export default function Index() {
  const {session, signOut} = useSession();
  const today = new Date().toISOString().split('T')[0];
  const [agendaItems, setAgendaItems] = useState([] as AgendaItemType[]);
  const [markerDots, setDots] = useState({} as MarkedDates)

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
    const currentUser = getUserID(session);
    getCalendarEvents({
      token: session,
      timeMin: timeMin,
      timeMax: timeMax,
      attendeePersonId: [currentUser]
    }).then(r => {
      setAgendaItems(r);
      getDots(r);
    });
  }, []);

  if (session) { // fetch data on useeffect if session
    useEffect(() => {

      const currentUser = getUserID(session);

      if (currentUser) {
        const {timeMin, timeMax} = getMonthStartEnd(new Date().getFullYear(), new Date().getMonth());
        getCalendarEvents({
          token: session,
          timeMin: timeMin,
          timeMax: timeMax,
          attendeePersonId: [currentUser]
        }).then(r => {
          setAgendaItems(r);
          getDots(r);
        })
      }
    }, []);
  }

  const renderAgendaItem = useCallback(({item}: any) => {
    return <AgendaItem item={item}/>
  }, []);

  const getDots = useCallback((events: AgendaItemType[]) => {
    let tempObject = {}
    for (const day of events) {
      const dots = day.data.map((event: any) => ({
        key: event.id + 'dot', color: eventTypes[event.type].color, selectedDotColor: 'white'
      }));
      tempObject[day.title] = {marked: true, selected: false, dots: dots}
    }
    setDots(tempObject)
  }, [])

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <CalendarProvider date={today} onMonthChange={onMonthChange}>
        <ExpandableCalendar firstDay={1} markedDates={markerDots} markingType={'multi-dot'}>
          {
            // @ts-ignore fix for defaultProps warning: https://github.com/wix/react-native-calendars/issues/2455
            ExpandableCalendar.defaultProps = undefined
          }
        </ExpandableCalendar>
        <Suspense fallback={'asdf'}>
          <AgendaList sections={agendaItems} renderItem={renderAgendaItem}></AgendaList>
        </Suspense>

      </CalendarProvider>
    </View>
  );
}
