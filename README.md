# Expo React Native App - ReadMe

## Navigation

### Tab Bar Navigation

Die Tab Bar Navigation befindet sich in der Datei:

```
/components/tab-navigator.tsx
```

Beispiel Tab Navigator:

```tsx
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
</Tab.Navigator>
```

#### Neue Seite hinzufügen

Um eine neue Seite zu erstellen, muss ein neuer `Tab.Screen` hinzugefügt werden. Dabei ist Folgendes zu beachten:

1. Die neue Komponente (`Screen`) muss importiert werden.
2. Die Komponente muss im `component`-Prop des `Tab.Screen` übergeben werden.

### Stack Navigation innerhalb von Screens

Innerhalb der Screens kann ebenfalls navigiert werden. Dafür wird `useNavigation` von `@react-navigation/native` verwendet.

Da das Projekt mit TypeScript entwickelt wird, muss zusätzlich `NavigationProp` und `RootStackParamList` importiert werden:

```tsx
const navigation = useNavigation<NavigationProp<RootStackParamList>>();
```

#### Navigation zu einer anderen Seite

Ein Button zur Navigation zu einer anderen Seite kann folgendermaßen implementiert werden:

```tsx
<Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
```

### Definition der Navigationstypen

Die Typisierung für die Navigation befindet sich in:

```
/types/navigation.d.ts
```

Beispiel für `RootStackParamList`:

```tsx
export type RootStackParamList = {
  Home: undefined;
  SecondScreen: undefined;
  ThirdScreen: undefined;
};
```

Falls eine Route keine Parameter benötigt, wird sie mit `undefined` definiert.

## Styling

Das Projekt verwendet **NativeWind**, was die Nutzung von Tailwind-Klassen ermöglicht.

Beispiel für Styling mit NativeWind:

```tsx
<Text className="text-center text-lg font-bold">Hello World</Text>
```

### Login Daten

Login Daten um auf die Inhalte der App zugreifen zu können:

Hörer:
E-Mail: demo@mail.de
Passwort: 123456

Moderator:
E-Mail: moderator@mail.de
Passwort: 123456
