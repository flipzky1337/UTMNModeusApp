import { View, ActivityIndicator, Text } from "react-native";

function GenericLoader() {
  return (
    <View className="flex-1 justify-center align-middle">
      <ActivityIndicator size={"large"} color='#000000'></ActivityIndicator>
      <View className="items-center">
        <Text className="text-xl">Лоадинг плис вейт...</Text>
      </View>
    </View>
  );
}

export default GenericLoader;
