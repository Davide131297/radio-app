import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from 'screens/home-screen';
import { SecondScreen } from 'screens/second-screen';
import { ThirdScreen } from 'screens/third-screen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
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
                  ? focused ? 'home' : 'home-outline'
                  : route.name === 'SecondScreen'
                  ? focused ? 'star' : 'star-outline'
                  : focused ? 'radio' : 'radio-outline'
              }
              size={22}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#46CDCF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="SecondScreen"
        component={SecondScreen}
        options={{ tabBarLabel: 'Reviews' }}
      />
      <Tab.Screen
        name="ThirdScreen"
        component={ThirdScreen}
        options={{ tabBarLabel: 'Sender' }}
      />
    </Tab.Navigator>
  );
}
