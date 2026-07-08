import { useTheme } from "@filmato/mobile/store/theme";
import { Blur, Canvas, Circle, Group, RadialGradient, vec } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Easing, SharedValue, useDerivedValue, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export default function GradientOrb({ windowSize }: { windowSize: SharedValue<{ width: number; height: number }> }) {
    const { theme } = useTheme();
    const breatheScale = useSharedValue(1);
    const cx = useDerivedValue(() => windowSize.value.width * 0.65);
    const cy = useDerivedValue(() => windowSize.value.height * 0.15);
    const radius = useDerivedValue(() => ((Math.max(windowSize.value.width, windowSize.value.height) / 1.25) * 0.5) * breatheScale.value)
    const gradientCenter = useDerivedValue(() => vec(cx.value * 1.35, cy.value * 0.75));
    const gradientRadius = useDerivedValue(() => radius.value * 1.35);

    useEffect(() => {
        breatheScale.value = 1;
        breatheScale.value = withRepeat(
            withTiming(1.35, {
                duration: 3500,
                easing: Easing.inOut(Easing.ease)
            }),
            -1,
            true
        );
    }, [theme])

    return (
        <Canvas style={style.canvas}>
            <Group>
                <Blur blur={70} />
                <Circle cx={cx} cy={cy} r={radius}>
                    <RadialGradient
                        c={gradientCenter}
                        r={gradientRadius}
                        colors={["#BEA4E5", "#C88EFF", "#0C001A"]}
                    />
                </Circle>
            </Group>
        </Canvas>
    );
}

const style = StyleSheet.create({
    canvas: {
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        position: "absolute"
    }
});