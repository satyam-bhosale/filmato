import { useRequestPasswordResetOtp } from "@filmato/auth-client/shared";
import { AUTH_CONSTANTS } from "@filmato/constants";
import { useResend } from "@filmato/hooks";
import { AuthFormCard, AuthFormContent, AuthFormDescription, AuthFormHeader, AuthFormTitle } from "@filmato/mobile/features/auth/components/auth-form-card";
import { ResetPasswordForm } from "@filmato/mobile/features/auth/components/forms/reset-password-form";
import authClient from "@filmato/mobile/lib/auth";
import { useTheme } from "@filmato/mobile/store/theme";
import { font, fontSize } from "@filmato/mobile/theme/fonts";
import { formatDuration, parseDuration } from "@filmato/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function ResetPassword() {
    const { email } = useLocalSearchParams();

    const userEmail = (typeof email === "string") ? email : null;

    useEffect(() => {
        if (!userEmail) {
            toast.error("Email address is required!");
            router.replace("/forget-password");
        }
    }, [userEmail]);

    if (!userEmail) return null;

    return (
        <SafeAreaView
            edges={["top", "bottom"]}
            style={[{ flex: 1 }]}
        >
            <KeyboardAvoidingView
                style={[styles.container]}
                behavior={Platform.OS === 'ios' ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <AuthFormCard>
                        <AuthFormHeader>
                            <AuthFormTitle>
                                Reset Password
                            </AuthFormTitle>
                            <AuthFormDescription>
                                Enter OTP and new password
                            </AuthFormDescription>
                        </AuthFormHeader>
                        <AuthFormContent style={{ flexDirection: "column", alignItems: "center", gap: 10 }}>
                            <ResetPasswordForm email={userEmail} />
                            <ResendRequestResetpasswordOtp email={userEmail} />
                        </AuthFormContent>
                    </AuthFormCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

function ResendRequestResetpasswordOtp({ email }: { email: string }) {
    const { window, max } = AUTH_CONSTANTS.RATELIMIT.requestPasswordResetOtp;
    const COOLDOWN = window / max;
    const { colors } = useTheme();
    const { requestPasswordResetOtp, status: { isPending } } = useRequestPasswordResetOtp(authClient);
    const { resend, remainingTime, isCooling } = useResend({
        cooldown: COOLDOWN,
        action: () => requestPasswordResetOtp({ email }),
        onSuccess: () => toast.success(`Verification code sent to ${email}`),
        onError: (error) => {
            if (error?.retryAfter) {
                toast.error(`Too many requests, please try again after ${formatDuration(parseDuration(error?.retryAfter), { format: 'short' })}`);
            } else {
                toast.error(error.message ?? "Failed to send verification code");
            }
        }
    });

    return (
        <View style={{ flex: 1, alignItems: "center", flexDirection: "row", paddingTop: 10 }}>
            <Text style={[font.regular, fontSize.sm, { color: colors.textPrimary }]}>
                Didn't receive the code?{" "}
            </Text>

            {!isCooling ? (
                <Pressable onPress={resend} disabled={isPending || isCooling}>
                    <Text style={[font.semibold, { color: colors.accentLight, opacity: isPending ? 0.5 : 1 }]}>
                        {(isPending) ? "Sending..." : "Resend"}
                    </Text>
                </Pressable>
            ) : (
                <Text style={[font.semibold, { color: colors.accentLight }]}>
                    {formatDuration(parseDuration(remainingTime), { format: "digital" })}
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: "flex-end"
    }
});