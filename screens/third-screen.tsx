import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from 'types/navigation';

import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function ThirdScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { logout, error } = useAuth();

  async function handleLogout() {
    await logout();
    if (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="bg-green-50 p-5">
          <Text className="text-2xl font-bold text-gray-800">Radio App</Text>
          <Text className="mt-1 text-base text-gray-600">Third Sceen</Text>
        </View>

        <View className="flex h-full flex-col gap-3 p-5">
          <Button onPress={() => navigation.navigate('Home')}>
            <ButtonText>Go to Home</ButtonText>
          </Button>
          <Button onPress={handleLogout}>
            <ButtonText>Logout</ButtonText>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
