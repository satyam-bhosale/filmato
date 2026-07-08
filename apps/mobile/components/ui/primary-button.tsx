import { font } from "@filmato/mobile/theme/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";

type Props = PressableProps & {
    children: string | ReactNode;
};

export default function PrimaryButton({ children, ...props }: Props) {

    return (
        <Pressable style={styles.pressable} {...props}>
            <LinearGradient
                colors={["#FFE08A", "#FFC72E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            >
                <View
                    style={styles.container}
                >
                    <LinearGradient
                        colors={["#D19900", "#FFE08A",]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.innerGradient}
                    >
                        <>
                            {typeof children === "string" ? (
                                <Text style={[font.medium, { color: "#24005C", fontWeight: "600", fontSize: 16 }]}>
                                    {children}
                                </Text>
                            ) : (
                                children
                            )}
                        </>
                    </LinearGradient>
                </View>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        width: "100%",
        height: 50,
        alignItems: "center",
        overflow: "hidden"
    },
    gradient: {
        width: "100%",
        height: "100%",
        paddingVertical: 3,
        paddingHorizontal: 3,
        alignItems: "center",
        borderRadius: 12,
        justifyContent: "center",
    },
    innerGradient: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        gap: 5
    },
    container: {
        width: "100%",
        height: "100%",
        flex: 1,
        position: "relative",
        overflow: "hidden"
    },
})