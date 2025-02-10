import {View, Text, TouchableOpacity} from "react-native"
import {memo} from "react";
import {getMonthStartEnd, objectIsEmpty} from "@/app/functions/UtilityFunctions";
import {Entypo} from "@expo/vector-icons";
import {eventTypes} from "@/app/types/ModeusAPITypes";
import {generateDay} from "react-native-calendars/src/dateutils";

interface AgendaProps {
  item: agendaPropItemType
}

type agendaPropItemType = {
  title: string,
  location: string,
  organizer: string[],
  type: string,
  timeStart: string,
  timeEnd: string,
}

export function fillBlank(props: {}[], selDate: string | Date) {
  const date = typeof selDate == "string" ? new Date(selDate) : selDate
  const start = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  const end = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59));

  let tempDate = new Date(start);
  while (tempDate != end) {

  }
}

function AgendaItem(props: AgendaProps) {
  const {item} = props;
  let organizers = '';

  console.log(props)

  if (!item) {

    return (
      <TouchableOpacity>
        <Text>
          Сегодня нет занятий.
        </Text>
      </TouchableOpacity>
    )
  }

  const maxIndex = item.organizer.length >= 3 ? 3 : item.organizer.length
  item.organizer.slice(0, maxIndex).map((org: string, idx: number) => {
    if (idx == maxIndex - 1) {
      organizers += org;
    } else {
      organizers += org + ', ';
    }
  });

  if (maxIndex == 3) {
    organizers += '...';
  }


  // if (item.organizer.length == 1) {
  //   organizers = item.organizer
  // } else {
  //
  //
  //   item.organizer.slice(0, lastIndex).map((org: string, idx: number) => {
  //     organizers += org + ', '
  //
  //     if item
  //
  //     if (idx == 2) {
  //       organizers += '...'
  //     }
  //   })
  // }

  return (
    <TouchableOpacity className={'mb-2 px-4 bg-white'}>
      <View className={'flex-1'}>
        <View>
          <View className={'flex-1 flex-row justify-between'} style={{alignItems: 'center'}}>
            <Text className={'font-bold text-2xl'}>
              {item.timeStart.slice(0, -3)} - {item.timeEnd.slice(0, -3)}
            </Text>
            <Text className={'px-2'} style={{backgroundColor: eventTypes[item.type].color}}>
              {eventTypes[item.type].name}
            </Text>
          </View>
          <Text className={'text-lg'}>{item.title}</Text>
        </View>
        <View className={'flex-row gap-2'} style={{alignItems: 'center'}}><Entypo name={'open-book'}></Entypo><Text
          className={'text-lg'}>{item.unitShort}</Text></View>
        <View className={'flex-row gap-2'} style={{alignItems: 'center'}}><Entypo name={'location-pin'}></Entypo><Text
          className={'text-lg'}>{item.location}</Text></View>
        <View className={'flex-row gap-2'} style={{alignItems: 'center'}}><Entypo name={'users'}></Entypo>{
          <Text className={'text-lg'} numberOfLines={3} style={{flex: 1, flexWrap: 'wrap'}}>
            {/*{item.organizer.slice(0, 3).map((organizer: string, index: number) => {*/}
            {/*  if (item.organizer.length == 1) {*/}
            {/*    return item.organizer.length*/}
            {/*  } else {*/}
            {/*    return organizer + ', '*/}
            {/*  }*/}
            {/*})}*/}
            {organizers}
          </Text>
        }</View>
      </View>
    </TouchableOpacity>


  )
}

export default memo(AgendaItem)