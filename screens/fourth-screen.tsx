import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, Image, Text } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/initSupabase';

type UserData = User & {
  user_name?: string;
  role?: string | null;
};

export default function FourthScreen() {
  const { logout, error, user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        if (data) {
          console.log('User data:', data);
          const userData = {
            ...user,
            user_name: data.user_name,
            role: data.role,
          };
          setUserData(userData);
        }
      } catch (err) {
        console.error('Unexpected error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [user]);

  async function handleLogout() {
    await logout();
    if (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="mb-5 items-center rounded-lg bg-white p-5 shadow-md">
          <Image
            source={{
              uri:
                'https://dl.dropboxusercontent.com/scl/fi/4gyrrgse59aq1zbxypvcg/logo.png?rlkey=fgca2dl2h3xup4tkgls651imv&st=hhayj5xu&dl=1' +
                Date.now(),
            }}
            className="mb-2 h-16 w-36"
            resizeMode="contain"
          />
        </View>
        <View className="mt-5 items-center">
          {userData && (
            <View className="mb-10 mt-5 items-center">
              <Text className="mb-2 text-lg text-gray-800">Email: {userData.email}</Text>
              <Text className="mb-2 text-lg text-gray-800">
                Erstellungsdatum: {new Date(userData.created_at).toLocaleDateString()}
              </Text>
              <Text className="text-lg text-gray-800">Benutzername: {userData.user_name}</Text>
            </View>
          )}
          <Button onPress={handleLogout} className="bg-red-500">
            <ButtonText className="text-white">Logout</ButtonText>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
