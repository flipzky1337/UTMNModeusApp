import {View, Text, TouchableOpacity} from "react-native"
import {memo} from "react";
import {objectIsEmpty} from "@/app/functions/UtilityFunctions";

interface AgendaProps {
  item: any
}

function AgendaItem(props: AgendaProps) {
  const {item} = props;
  console.log(item)

  if (objectIsEmpty(item)) {
    return (
      <TouchableOpacity>
        <Text>
          Сегодня нет занятий.
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity>
      <View>
        <Text>
          {item.timeStart.slice(0, -3)} - {item.timeEnd.slice(0, -3)}
        </Text>
      </View>
      <Text>{item.title}</Text>
    </TouchableOpacity>


  )
}

export default memo(AgendaItem)