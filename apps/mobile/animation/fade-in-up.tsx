import { ReactNode, useEffect } from "react";
import { ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

type Props = ViewProps & {
    children: ReactNode;
    delay?: number;
}

export default function FadeInUp({ children, style, delay = 0, ...rest }: Props) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-10);

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(1, {
            duration: 800
        }));

        translateY.value = withDelay(delay, withTiming(0, {
            duration: 800
        }));

    }, []);

    const fadeUpReveal = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            {
                translateY: translateY.value
            }
        ]
    }));

    return (
        <Animated.View style={[style, fadeUpReveal]} {...rest}>
            {children}
        </Animated.View>
    )
}