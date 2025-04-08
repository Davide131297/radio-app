import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import { HomeScreen } from 'screens/home-screen';
import { SecondScreen } from 'screens/second-screen';
import { ThirdScreen } from 'screens/third-screen';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/initSupabase';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const [isModerator, setIsModerator] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .then(({ data }) => {
          if (data && data[0]?.role === 'moderator') {
            setIsModerator(true);
          }
        });
    }
  }, [user]);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          height: 80,
        },
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Ionicons
              name={
                route.name === 'Home'
                  ? focused
                    ? 'home'
                    : 'home-outline'
                  : route.name === 'SecondScreen'
                    ? focused
                      ? 'star'
                      : 'star-outline'
                    : focused
                      ? 'radio'
                      : 'radio-outline'
              }
              size={22}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#46CDCF',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      {!isModerator && (
        <Tab.Screen
          name="SecondScreen"
          component={SecondScreen}
          options={{ tabBarLabel: 'Reviews' }}
        />
      )}
      {isModerator && (
        <Tab.Screen
          name="ThirdScreen"
          component={ThirdScreen}
          options={{ tabBarLabel: 'Sender' }}
        />
      )}
    </Tab.Navigator>
  );
}
