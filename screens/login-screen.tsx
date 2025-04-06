import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from 'tailwindcss/colors';
import { RootStackParamList } from 'types/navigation';

import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets(); // Dynamische Insets für Notch
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleState = () => {
    setShowPassword((showState: boolean) => {
      return !showState;
    });
  };
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, error, loading } = useAuth();

  useEffect(() => {
    if (email && password) {
      setIsDisabled(false);
    }
  }, [email, password]);

  async function handleLogin() {
    if (email && password) {
      await login(email.toLowerCase(), password);
      if (error) {
        setErrorMessage('Login fehlgeschlagen: ' + error);
        console.log(error);
      }
    } else {
      setErrorMessage('Bitte fülle alle Felder aus');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top, backgroundColor: 'white' }}>
      <View className="flex h-full flex-col items-center justify-center gap-6 px-4">
        <Text className="text-2xl font-bold text-blue-500">Anmelden</Text>
        <Text className="text-base text-gray-600">Bitte melde dich an um fortzufahren</Text>

        {/* Email Input */}
        <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
          <InputField placeholder="Deine Email" value={email} onChangeText={setEmail} />
        </Input>

        {/* Password Input */}
        <Input className="text-center">
          <InputField
            type={showPassword ? 'text' : 'password'}
            placeholder="Passwort"
            value={password}
            onChangeText={setPassword}
          />
          <InputSlot className="pr-3" onPress={handleState}>
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
          </InputSlot>
        </Input>
        <View className="flex flex-col gap-8">
          {/* Login Button */}
          {!loading ? (
            <Button
              size="md"
              variant="solid"
              action="primary"
              disabled={isDisabled}
              onPress={handleLogin}>
              <ButtonText>Anmelden</ButtonText>
            </Button>
          ) : (
            <Button className="p-3">
              <ButtonSpinner color={colors.gray[400]} />
              <ButtonText className="ml-2 text-sm font-medium">Bitte warten</ButtonText>
            </Button>
          )}
          {errorMessage && <Text className="text-red-500">{errorMessage}</Text>}

          {/* Register Button */}
          <Button
            size="md"
            variant="link"
            action="primary"
            onPress={() => navigation.navigate('RegisterScreen')}>
            <ButtonText>Hier klicken falls du noch keinen Account hast</ButtonText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
