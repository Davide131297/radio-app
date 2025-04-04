import { Button } from '@react-navigation/elements';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from 'types/navigation';

import { useAuth } from '@/hooks/useAuth';

export function ThirdScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { logout, error } = useAuth();

  async function handleLogout() {
    await logout();
    if (error) {
      console.log(error);
    } else {
      navigation.navigate('LoginScreen');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="bg-gray-50 p-5">
          <Text className="text-2xl font-bold text-gray-800">Radio App</Text>
          <Text className="mt-1 text-base text-gray-600">Third Sceen</Text>
        </View>

        <View>
          <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
          <Button onPress={handleLogout}>Logout</Button> //! Only for testing
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
