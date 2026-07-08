import { useVerifyEmailOtp } from "@filmato/auth-client/shared";
import FadeInUp from "@filmato/mobile/animation/fade-in-up";
import OTPInput from "@filmato/mobile/components/ui/otp-input";
import PrimaryButton from "@filmato/mobile/components/ui/primary-button";
import SpinningLoader from "@filmato/mobile/components/ui/spinning-loader";
import { useVerifyEmailOtpForm } from "@filmato/mobile/forms";
import authClient from "@filmato/mobile/lib/auth";
import { font } from "@filmato/mobile/theme/fonts";
import { router } from "expo-router";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";

export function VerifyEmailForm({ email }: { email: string }) {
    const { verifyEmailOtp, status: { isPending } } = useVerifyEmailOtp(authClient);
    const { handleVerifyEmailOtp, control, reset, formState: { isValid, isSubmitting, errors } } = useVerifyEmailOtpForm({
        onSubmit: ({ otp }) => {
            toast.promise(verifyEmailOtp({ email, otp }).then((result => {
                if (result.error) throw result.error;
                return result.data;
            })), {
                loading: "Verifying your email...",
                success: () => {
                    reset();
                    router.replace('/');
                    return 'Verification was successful'
                },
                error: (error: any) => error?.message ?? "Failed to verify email"
            })
        }
    })

    return (
        <View style={styles.verifyEmail}>
            <FadeInUp delay={250}>
                <Controller
                    name="otp"
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <OTPInput
                            length={6}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.otp?.message}
                        />
                    )}
                />
            </FadeInUp>
            <FadeInUp delay={550}>
                <PrimaryButton
                    onPress={handleVerifyEmailOtp}
                    disabled={!isValid || isSubmitting || isPending}
                >
                    {(isSubmitting || isPending) && (
                        <SpinningLoader size={18} color="#24005C" />
                    )}
                    <Text style={[font.bold, { color: "#24005C", fontWeight: "600", fontSize: 16 }]}>
                        {(isSubmitting || isPending) ? "Verifying..." : "Verify Email"}
                    </Text>
                </PrimaryButton>
            </FadeInUp>
        </View>
    );
}

const styles = StyleSheet.create({
    verifyEmail: {
        width: "100%",
        flexDirection: "column",
        gap: 10
    }
});