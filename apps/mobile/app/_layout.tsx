import {
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_900Black,
  useFonts
} from "@expo-google-fonts/montserrat";
import {
  Roboto_500Medium
} from "@expo-google-fonts/roboto";
import { useTheme } from "@filmato/mobile/store/theme";
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '/',
};

export default function RootLayout() {
  const scheme = useColorScheme();
  const { theme, setTheme } = useTheme();

  const [fontsLoaded, error] = useFonts({
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium,
    Roboto_500Medium,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }

  }, [fontsLoaded, error]);

  useEffect(() => {
    if (scheme === 'dark' || scheme === 'light') {
      setTheme(scheme);
    }
  }, [scheme, setTheme])

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
        <Toaster
          positionerStyle={
            Platform.OS === "android"
              ? { elevation: 999 }
              : undefined
          }
          theme={theme}
          position="top-center"
          swipeToDismissDirection="left"
          visibleToasts={5}
          autoWiggleOnUpdate="toast-change"
          enableStacking={true}
          pauseWhenPageIsHidden={true}
          gap={2}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
