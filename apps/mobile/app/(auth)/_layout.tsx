import GradientOrb from "@filmato/mobile/features/auth/components/gradient-orb";
import { useTheme } from "@filmato/mobile/store/theme";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function AuthLayout() {
    const windowSize = useSharedValue({ width: 0, height: 0 });
    const { theme, colors } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
            .catch(console.error);

        return () => {
            ScreenOrientation.unlockAsync()
                .catch(console.error);
        }
    }, []);

    return (
        <View
            style={[styles.authView, { backgroundColor: colors.background }]}
            onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout
                windowSize.value = { width, height };
            }}
        >
            {isDark && <GradientOrb windowSize={windowSize} />}
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "fade",
                    animationDuration: 800,
                    contentStyle: styles.rootStack
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    rootStack: {
        backgroundColor: "transparent"
    },
    authView: {
        width: "100%",
        flex: 1,
        position: "relative"
    }
})