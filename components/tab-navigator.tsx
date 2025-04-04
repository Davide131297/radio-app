import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from 'screens/home-screen';
import { SecondScreen } from 'screens/second-screen';
import { ThirdScreen } from 'screens/third-screen';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { paddingBottom: 5 },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Page 1',
        }}
      />
      <Tab.Screen
        name="SecondScreen"
        component={SecondScreen}
        options={{
          tabBarLabel: 'Page 2',
        }}
      />
      <Tab.Screen
        name="ThirdScreen"
        component={ThirdScreen}
        options={{
          tabBarLabel: 'Page 3',
        }}
      />
    </Tab.Navigator>
  );
}
