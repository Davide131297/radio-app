import { NavigationContainer } from '@react-navigation/native';

import { TabNavigator } from './components/tab-navigator';

import './global.css';

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
