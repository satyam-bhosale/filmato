import { useTheme } from "@filmato/mobile/store/theme";
import { font, fontSize } from "@filmato/mobile/theme/fonts";
import { BackdropBlur, Canvas, RoundedRect } from "@shopify/react-native-skia";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
    length?: number
    value?: string,
    error?: string,
    label?: string
}

export default function OTPInput({ length = 6, value, error, label, ...props }: Props) {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const { theme, colors } = useTheme();
    const isDark = theme === "dark";

    const inputRef = useRef<TextInput>(null);
    return (
        <View style={[styles.mainContainer]}>
            {label && (
                <Text style={[font.semibold, styles.label, { color: colors.textPrimary }]}>
                    {label}
                </Text>
            )}
            <View>
                <Pressable
                    style={[styles.otpContainer]}
                    onPress={() => {
                        inputRef.current?.blur();
                        inputRef.current?.focus();
                    }}
                >

                    {
                        Array.from({ length }).map((_, index) => (
                            <View key={index} style={[styles.digitBox, {
                                borderWidth: (value?.length === index || (value?.length === length && index === length - 1)) ? 3 : 1.5,
                                borderColor: (value?.length === index || (value?.length === length && index === length - 1)) ? colors.borderFocus : "#FFFFFF33"
                            }]}
                                onLayout={(e) => {
                                    const { width, height } = e.nativeEvent.layout;
                                    setSize({ width, height });
                                }}
                            >
                                {size.width > 0 && (
                                    <Canvas style={StyleSheet.absoluteFill}>
                                        <BackdropBlur blur={16} clip={{ x: 0, y: 0, width: size.width, height: size.height }}>
                                            <RoundedRect
                                                x={0}
                                                y={0}
                                                width={size.width}
                                                height={size.height}
                                                r={8}
                                                color={isDark ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.2)"}
                                            />
                                        </BackdropBlur>
                                    </Canvas>
                                )}
                                <Text style={[styles.digit, font.semibold]}>
                                    {value?.[index]}
                                </Text>
                            </View>
                        ))
                    }
                </Pressable>
                {error && (
                    <Text style={[styles.errorText, font.medium, { color: "#ff0e00" }]}>
                        {error}
                    </Text>
                )}
            </View>
            <TextInput
                {...props}
                style={[styles.hiddenInput]}
                maxLength={length}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                selectionHandleColor={`${colors.background}00`}
                ref={inputRef}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: "relative",
        paddingBottom: 10
    },
    label: {
        marginBottom: 4,
        fontSize: 13,
    },
    otpContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9
    },
    digitBox: {
        flex: 1,
        height: 52,
        borderRadius: 10,
        borderStyle: "solid",
        position: "relative",
        borderColor: "rgba(255,255,255,0.2)",
        overflow: "hidden"
    },
    hiddenInput: {
        position: "absolute",
        left: "-100%",
        width: "0%",
        height: "0%",
        opacity: 0
    },
    digit: {
        flex: 1,
        textAlign: "center",
        textAlignVertical: "center",
        ...fontSize["xl"],
        color: "#ffcc00"
    },
    errorText: {
        marginTop: 5
    }
})