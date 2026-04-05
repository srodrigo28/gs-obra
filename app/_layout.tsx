import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider } from '@/providers/session-provider';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ contentStyle: { backgroundColor: '#F4F0E8' }, headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="cadastro" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="perfil" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
