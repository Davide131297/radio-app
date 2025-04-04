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

export function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordRepeat, setPasswordRepeat] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, error, loading } = useAuth();

  const handleStatePassword = () => {
    setShowPassword((showState: boolean) => {
      return !showState;
    });
  };

  const handleStatePasswordRepeat = () => {
    setShowPasswordRepeat((showState: boolean) => {
      return !showState;
    });
  };

  useEffect(() => {
    if (email && password && passwordRepeat && password === passwordRepeat) {
      setIsDisabled(false);
    }
  }, [email, password, passwordRepeat]);

  async function handlePress() {
    if (email && password && passwordRepeat && password === passwordRepeat) {
      await register(email, password);
      if (error) {
        setErrorMessage('Registrierung fehlgeschlagen: ' + error);
        setErrorMessage('Registrierung fehlgeschlagen: Kein Benutzer zurückgegeben');
        console.log(error);
      } else {
        navigation.navigate('Home');
      }
    } else {
      setErrorMessage('Die Passwörter stimmen nicht überein oder die Felder sind leer');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top, backgroundColor: 'white' }}>
      <View className="flex h-full flex-col items-center justify-center gap-6 px-4">
        <Text className="text-2xl font-bold text-blue-500">Registrieren</Text>
        <Text className="text-base text-gray-600">
          Registriere dich jezt um die App nutzen zu können
        </Text>

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
          <InputSlot className="pr-3" onPress={handleStatePassword}>
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
          </InputSlot>
        </Input>

        {/* Password Repeat Input */}
        <Input className="text-center">
          <InputField
            type={showPasswordRepeat ? 'text' : 'password'}
            placeholder="Passwort Wiederholung"
            value={passwordRepeat}
            onChangeText={setPasswordRepeat}
          />
          <InputSlot className="pr-3" onPress={handleStatePasswordRepeat}>
            <InputIcon as={showPasswordRepeat ? EyeIcon : EyeOffIcon} />
          </InputSlot>
        </Input>

        <View className="flex flex-col gap-8">
          {/* Register Button */}
          {!loading ? (
            <Button
              size="md"
              variant="solid"
              action="primary"
              isDisabled={isDisabled}
              onPress={handlePress}>
              <ButtonText>Registrieren</ButtonText>
            </Button>
          ) : (
            <Button className="p-3">
              <ButtonSpinner color={colors.gray[400]} />
              <ButtonText className="ml-2 text-sm font-medium">Bitte warten</ButtonText>
            </Button>
          )}
          {errorMessage && <Text className="text-red-500">{errorMessage}</Text>}

          {/* Login Button */}
          <Button
            size="md"
            variant="link"
            action="primary"
            onPress={() => navigation.navigate('LoginScreen')}>
            <ButtonText>Hier klicken falls du bereits einen Account hast</ButtonText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
