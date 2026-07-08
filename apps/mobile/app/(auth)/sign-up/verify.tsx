import { useSendVerificationOtp } from "@filmato/auth-client/shared";
import { AUTH_CONSTANTS } from "@filmato/constants";
import { useResend } from "@filmato/hooks";
import { AuthFormCard, AuthFormContent, AuthFormDescription, AuthFormHeader, AuthFormTitle } from "@filmato/mobile/features/auth/components/auth-form-card";
import { VerifyEmailForm } from "@filmato/mobile/features/auth/components/forms/verify-email-form";
import authClient from "@filmato/mobile/lib/auth";
import { useTheme } from "@filmato/mobile/store/theme";
import { font, fontSize } from "@filmato/mobile/theme/fonts";
import { formatDuration, parseDuration } from "@filmato/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function VerifyOTPScreen() {
    const { email } = useLocalSearchParams();

    const userEmail = typeof email === "string" ? email : null;

    useEffect(() => {
        if (!userEmail) {
            toast.error("Email address is required!");
            router.replace("/sign-up");
        }
    }, [userEmail]);

    if (!userEmail) return null;

    return (
        <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <AuthFormCard>
                        <AuthFormHeader>
                            <AuthFormTitle>Verify Email</AuthFormTitle>
                            <AuthFormDescription>
                                Enter the verification code and get started!
                            </AuthFormDescription>
                        </AuthFormHeader>
                        <AuthFormContent style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                            <VerifyEmailForm email={userEmail} />
                            <ResendVerificationOtp email={userEmail} />
                        </AuthFormContent>
                    </AuthFormCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function ResendVerificationOtp({ email }: { email: string }) {
    const { window, max } = AUTH_CONSTANTS.RATELIMIT.sendVerificationOtp;
    const COOLDOWN = window / max;
    const { colors } = useTheme();
    const { sendVerificationOtp, status: { isPending } } = useSendVerificationOtp(authClient);
    const {resend, remainingTime, isCooling} = useResend({
        cooldown: COOLDOWN,
        action: () => sendVerificationOtp({ email }),
        onSuccess: () => toast.success(`Sent verification code at ${email}`),
        onError: (error) => {
            if (error?.retryAfter) {
                toast.error(`Too many requests, please try again after ${formatDuration(parseDuration(error?.retryAfter), { format: 'short' })}`);
            } else {
                toast.error(error?.message ?? "Unable to send verification code");
            }
        }
    });

    return (
        <View style={{ flex: 1, alignItems: "center", flexDirection: "row", paddingTop: 10 }}>
            <Text style={[font.regular, fontSize.sm, { color: colors.textPrimary }]}>
                Didn't receive the code?{" "}
            </Text>

            {!isCooling ? (
                <Pressable onPress={resend} disabled={isCooling || isPending}>
                    <Text style={[font.semibold, { color: colors.accentLight, opacity: isPending ? 0.5 : 1 }]}>
                        {isPending ? "Sending..." : "Resend"}
                    </Text>
                </Pressable>
            ) : (
                <Text style={[font.semibold, { color: colors.accentLight }]}>
                    {formatDuration(parseDuration(remainingTime), { format: "digital" })}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: "flex-end"
    }
});