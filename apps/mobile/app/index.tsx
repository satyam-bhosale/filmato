import { useSignOut } from "@filmato/auth-client/shared";
import authClient from "@filmato/mobile/lib/auth";
import { useTheme } from "@filmato/mobile/store/theme";
import { font, fontSize } from "@filmato/mobile/theme/fonts";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";
    const { data, isPending, error, refetch, isRefetching } = authClient.useSession();
    const { signOut, status: { isPending: isSigningOutPending } } = useSignOut(authClient);
    
    return (
        <View style={[{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
            <Text style={[fontSize["4xl"], font.semibold, { color: isDark ? "#969696" : "#969696" }]}>Index("/")</Text>
            <Text
                style={[
                    font.medium,
                    fontSize["sm"],
                    {
                        color: colors.textPrimary,
                        marginTop: 10
                    }
                ]}
            >
                {(isPending || isRefetching)
                    ? "Loading session..."
                    : data?.user?.email ?? error?.error ?? "Nothing"}
            </Text>

            <Pressable onPress={() => router.push("/sign-in")}>
                <Text style={[font.medium, fontSize["lg"], { color: "#009CE8", paddingVertical: 10 }]}>Go to Sign In</Text>
            </Pressable>
            <Pressable onPress={() => refetch()} disabled={isPending || isRefetching || isSigningOutPending}>
                <Text style={[font.medium, fontSize["lg"], { color: "#11fa4f", paddingVertical: 10 }]}>Refetch</Text>
            </Pressable>
            <Pressable onPress={() => signOut()} disabled={isPending || isRefetching || isSigningOutPending}>
                <Text style={[font.medium, fontSize["lg"], { color: "#ff0000", paddingVertical: 10 }]}>Sign Out</Text>
            </Pressable>
        </View>
    );
}