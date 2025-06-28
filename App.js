import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { useFonts, Fredoka_400Regular, Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Baloo2_500Medium, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from './src/screens/HomeScreen';
import AvatarSelectionScreen from './src/screens/AvatarSelectionScreen';
import StartScreen from './src/screens/StartScreen';
import { theme } from './src/styles/theme';
import { store } from './src/store/store';

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  let [fontsLoaded] = useFonts({
    Fredoka_400Regular,
    Fredoka_600SemiBold,
    Nunito_400Regular,
    Nunito_700Bold,
    Baloo2_500Medium,
    Baloo2_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="AvatarSelection"
              component={AvatarSelectionScreen}
              options={({ route }) => ({
                headerShown: true,
                title: route.params?.storyType === 'robot' ? 'Choose Your Robot Engineer' : 'Choose Your Space Explorer',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontFamily: 'Fredoka_600SemiBold',
                  fontSize: 18,
                },
              })}
            />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
