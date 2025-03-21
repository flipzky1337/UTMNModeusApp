import { View, Text, ActivityIndicator } from "react-native";
import { useSession } from "@/app/providers/authctx";
import {
  AgendaList,
  CalendarProvider,
  DateData,
  ExpandableCalendar,
} from "react-native-calendars";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { getCalendarEvents } from "@/app/functions/ModeusAPIFunctions";
import { getUserID } from "@/app/functions/JWTFunctions";
import AgendaItem from "@/app/components/AgendaItem";
import { MarkedDates } from "react-native-calendars/src/types";
import { LocaleConfig } from "react-native-calendars";
import { eventTypes } from "@/app/types/ModeusAPITypes";
import {
  getMonthStartEnd,
  objectIsEmpty,
} from "@/app/functions/UtilityFunctions";
import GenericLoader from "../components/GenericLoader";

LocaleConfig.locales["ru"] = {
  monthNames: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  monthNamesShort: [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ],
  dayNames: [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ],
  dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  today: "Сегодня",
};

LocaleConfig.defaultLocale = "ru";

interface AgendaItemType {
  title: string;
  data: {}[];
}

export default function Index() {
  const { session, signOut } = useSession();
  const calendarRef = useRef();
  const today = new Date().toISOString().split("T")[0];
  const [agendaItems, setAgendaItems] = useState([] as AgendaItemType[]);
  const [markerDots, setDots] = useState({} as MarkedDates);
  const [calendarReady, setCalendarReady] = useState(false);
  const [agendaIsLoading, setAgendaIsLoading] = useState(true);

  const onMonthChange = useCallback(({ dateString }: DateData) => {
    const { timeMin, timeMax } = getMonthStartEnd(
      new Date(dateString).getFullYear(),
      new Date(dateString).getMonth()
    );
    // @ts-ignore it is string anyways, layout controls the background session checking
    const currentUser = getUserID(session);
    getCalendarEvents({
      token: session,
      timeMin: timeMin,
      timeMax: timeMax,
      attendeePersonId: [currentUser],
    }).then((r) => {
      setAgendaItems(r);
      getDots(r);
      setAgendaIsLoading(false);
    });
  }, []);

  if (session) {
    // fetch data on useeffect if session
    useEffect(() => {
      const currentUser = getUserID(session);

      if (currentUser) {
        const { timeMin, timeMax } = getMonthStartEnd(
          new Date().getFullYear(),
          new Date().getMonth()
        );
        getCalendarEvents({
          token: session,
          timeMin: timeMin,
          timeMax: timeMax,
          attendeePersonId: [currentUser],
        }).then((r) => {
          setAgendaItems(r);
          getDots(r);
          setAgendaIsLoading(false);
        });
      }
    }, []);
  }

  const renderAgendaItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} key={item.id} />;
  }, []);

  const getDots = useCallback((events: AgendaItemType[]) => {
    let tempObject = {};
    for (const day of events) {
      const dots = day.data.map((event: any) => ({
        key: event.id + "dot",
        color: eventTypes[event.type].color,
        selectedDotColor: "white",
      }));
      tempObject[day.title] = { marked: true, selected: false, dots: dots };
    }
    setDots(tempObject);
  }, []);

  function handleScrollFails(info) {
    console.log(info);
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <CalendarProvider date={today} onMonthChange={onMonthChange}>
        <ExpandableCalendar
          firstDay={1}
          markedDates={markerDots}
          markingType={"multi-dot"}
          onCalendarToggled={() => setCalendarReady(true)}
        >
          {
            // @ts-ignore fix for defaultProps warning: https://github.com/wix/react-native-calendars/issues/2455
            ExpandableCalendar.defaultProps = undefined
            
          }
          
        </ExpandableCalendar>
        {agendaIsLoading && calendarReady ? (
          <GenericLoader/>
        ) : (
          <AgendaList
            sections={agendaItems}
            renderItem={renderAgendaItem}
            infiniteListProps={{ itemHeight: 190, titleHeight: 60 }}
            sectionStyle={{height: 50, flex:1, marginBottom: 10, fontWeight: 700, fontSize: 15, textAlignVertical: 'baseline', justifyContent: "space-between"}}
          ></AgendaList>
        )}

        

        {/* <InfiniteAgendaList sections={agendaItems} renderItem={renderAgendaItem}></InfiniteAgendaList> */}
      </CalendarProvider>
    </View>
  );
}
