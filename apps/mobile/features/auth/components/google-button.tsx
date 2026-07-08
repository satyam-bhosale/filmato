import { useSocialSignIn } from "@filmato/auth-client/shared";
import GoogleIcon from "@filmato/mobile/components/icons/google-logo";
import authClient from "@filmato/mobile/lib/auth";
import { useTheme } from "@filmato/mobile/store/theme";
import { Loader2 } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

type Props = {
    mode: 'sign-in' | 'sign-up';
}

export default function GoogleButton({ mode }: Props) {
    const { theme } = useTheme();
    const {socialSignIn, status: {isPending}} = useSocialSignIn(authClient);
    const isDark = theme === "dark";
    return (
        <Pressable onPress={() => socialSignIn({
            provider: 'google',
            callbackURL: "/"
        })}>
            <View style={[styles.container, { backgroundColor: isDark ? "#131314" : "#FFFFFF", borderColor: isDark ? "#8E918F" : "#000000" }]}>
                <GoogleIcon />
                <Text style={[styles.text, { color: isDark ? "#E3E3E3" : "#1F1F1F " }]}>
                    {
                        mode === 'sign-in'
                            ? "Sign In with Google"
                            : "Sign Up with Google"
                    }
                </Text>
                {isPending && <SpinningLoader size={20} color={isDark ? "#969696" : "#000000"} />}
            </View>
        </Pressable>
    );
}

function SpinningLoader({ size, color }: { size: number; color: string }) {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 1000, easing: Easing.linear }),
            -1
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <Loader2 size={size} color={color} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    },
    text: {
        fontSize: 16,
        fontWeight: 500,
        fontFamily: "Roboto_500Medium"
    }
})