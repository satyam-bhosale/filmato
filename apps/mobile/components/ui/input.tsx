import { useTheme } from '@filmato/mobile/store/theme';
import { font } from '@filmato/mobile/theme/fonts';
import { BackdropBlur, Canvas, RoundedRect } from "@shopify/react-native-skia";
import { Eye, EyeClosed } from 'lucide-react-native';
import { forwardRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
    isPassword?: boolean;
    error?: string;
    label?: string;
};

const Input = forwardRef<TextInput, Props>(({ label, isPassword = false, error, onFocus, onBlur, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const { theme, colors } = useTheme();
    const isDark = theme === "dark";

    return (
        <View style={{flex: 1}}>
            {label && <Text style={[font.semibold, styles.label, { color: colors.textPrimary }]}>
                {label}
            </Text>}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && { ...styles.inputContainerFocused, borderColor: colors.borderFocus },
                    !!error && styles.inputContainerError,
                ]}
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
                                r={12}
                                color={isDark ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.2)"}
                            />
                        </BackdropBlur>
                    </Canvas>
                )}

                <TextInput
                    ref={ref}
                    {...props}
                    onFocus={(e) => {
                        setIsFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    secureTextEntry={isPassword && hidePassword}
                    style={[font.medium, styles.textInput, style, { color: colors.textPrimary }]}
                    placeholderTextColor={isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"}
                />

                {isPassword && (
                    <Pressable
                        style={styles.eyeButton}
                        onPress={() => setHidePassword(prev => !prev)}
                    >
                        {hidePassword
                            ? <EyeClosed size={20} color={
                                error ? "#FF3B30" : isFocused ?
                                    (isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)")
                                    : isDark ? "rgba(255,255,255,1)" : "rgba(140,140,140,1)"}
                            />
                            : <Eye size={20} color={
                                error ? "#FF3B30" : isFocused ?
                                    (isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)")
                                    : isDark ? "rgba(255,255,255,1)" : "rgba(140,140,140,1)"}
                            />
                        }
                    </Pressable>
                )}
            </View>

            {error && (
                <Text style={[styles.errorText, font.medium, { color: "#ff0e00" }]}>
                    {error}
                </Text>
            )}
        </View>
    );
});

export default Input;

const styles = StyleSheet.create({
    label: {
        marginBottom: 4,
        fontSize: 13,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        overflow: "hidden",
    },
    inputContainerFocused: {
        borderWidth: 2,
    },
    inputContainerError: {
        borderColor: "#FF3B30",
        borderWidth: 2,
    },
    textInput: {
        flex: 1,
        width: "100%",
        padding: 14,
        fontSize: 15,
    },
    eyeButton: {
        paddingHorizontal: 12,
    },
    errorText: {
        marginTop: 5
    }
});