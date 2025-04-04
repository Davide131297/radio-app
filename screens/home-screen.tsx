import { Button } from '@react-navigation/elements';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from 'types/navigation';

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="bg-gray-50 p-5">
          <Text className="text-2xl font-bold text-gray-800">Radio App</Text>
          <Text className="mt-1 text-base text-gray-600">Your favorite stations</Text>
        </View>

        <View className="p-5">
          <View className="rounded-xl bg-white p-4 shadow-md">
            <Text className="text-lg font-semibold text-gray-800">Featured Station</Text>
            <Text className="mt-1 text-sm text-gray-600">98.1 MHz</Text>
          </View>
        </View>

        <View>
          <Button onPress={() => navigation.navigate('SecondScreen')}>Go to Details</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
