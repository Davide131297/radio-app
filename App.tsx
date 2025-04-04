import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { User } from '@supabase/supabase-js';
import { supabase } from 'initSupabase';
import { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TabNavigator } from './components/tab-navigator';
import { LoginScreen } from './screens/login-screen';
import { RegisterScreen } from './screens/register-screen';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

import '@/global.css';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      // Check the current user on component mount
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setIsAuthenticated(true);
        setUser(data.session.user);
      }
    };

    fetchSession();

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUser(session.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.subscription?.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <NavigationContainer>
          {isAuthenticated ? (
            <TabNavigator />
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
