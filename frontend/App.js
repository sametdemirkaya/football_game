import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Anton_400Regular } from '@expo-google-fonts/anton';
import { RobotoCondensed_400Regular, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';

import { GameProvider } from './src/context/GameContext';
import { theme } from './src/theme';

import HomeScreen from './src/screens/HomeScreen';
import PlayerSetupScreen from './src/screens/PlayerSetupScreen';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DifficultyScreen from './src/screens/DifficultyScreen';

// Sıçrama (Splash) ekranının fontlar yüklenene kadar kapanmamasını sağlar
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Anton_400Regular,
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Veya basit bir yükleme (Loading) görünümü dönebilir
  }

  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: theme.colors.background },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontFamily: theme.typography.fontFamily.heading, fontSize: theme.typography.sizes.lg },
              contentStyle: { backgroundColor: theme.colors.background },
              animation: 'slide_from_right', // Native hisli geçiş animasyonu
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ANA MENÜ' }} />
            <Stack.Screen name="PlayerSetup" component={PlayerSetupScreen} options={{ title: 'OYUNCU KURULUMU' }} />
            <Stack.Screen name="Difficulty" component={DifficultyScreen} options={{ title: 'ZORLUK SEÇİMİ' }} />
            <Stack.Screen name="Game" component={GameScreen} options={{ title: 'OYUN' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'AYARLAR' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </SafeAreaProvider>
  );
}
