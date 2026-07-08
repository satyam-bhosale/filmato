import { useResetPasswordOtp } from "@filmato/auth-client/shared";
import FadeInUp from "@filmato/mobile/animation/fade-in-up";
import Input from "@filmato/mobile/components/ui/input";
import OTPInput from "@filmato/mobile/components/ui/otp-input";
import PrimaryButton from "@filmato/mobile/components/ui/primary-button";
import SpinningLoader from "@filmato/mobile/components/ui/spinning-loader";
import { useResetPasswordOtpForm } from "@filmato/mobile/forms";
import authClient from "@filmato/mobile/lib/auth";
import { font } from "@filmato/mobile/theme/fonts";
import { router } from "expo-router";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";

export function ResetPasswordForm({ email }: { email: string }) {
    const { resetPasswordOtp, status: { isPending } } = useResetPasswordOtp(authClient);
    const { handleResetPassword, control, reset, formState: { isValid, isSubmitting, errors } } = useResetPasswordOtpForm({
        onSubmit: ({ confirmNewPassword, otp }) => {
            toast.promise(resetPasswordOtp({ email, password: confirmNewPassword, otp }).then((result => {
                if (result.error) {
                    throw result.error;
                }
                return result.data;
            })), {
                loading: "Resetting your password...",
                success: () => {
                    reset();
                    router.replace('/sign-in');
                    return "Your password has been reset"
                },
                error: (err: any) => {
                    if (err?.retryAfter) {
                        return `Too many requests, please try again after ${err?.retryAfter}`;
                    }

                    return err?.message ?? "Unable to reset your password"
                }
            })
        }
    });

    return (
        <View style={styles.resetPasswordForm}>
            <FadeInUp delay={250}>
                <Controller
                    name="newPassword"
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <Input
                            label="New Password"
                            isPassword={true}
                            placeholder="New Password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.newPassword?.message}
                        />
                    )}
                />
            </FadeInUp>
            <FadeInUp delay={350}>
                <Controller
                    name="confirmNewPassword"
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <Input
                            label="Confirm New Password"
                            isPassword={true}
                            placeholder="Confirm New Password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.confirmNewPassword?.message}
                        />
                    )}
                />
            </FadeInUp>
            <FadeInUp delay={450}>
                <Controller
                    name="otp"
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <OTPInput
                            label="OTP"
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
                    onPress={handleResetPassword}
                    disabled={isSubmitting || !isValid}
                >
                    {(isSubmitting || isPending) && <SpinningLoader size={18} color="#24005C" />}
                    <Text style={[font.bold, { color: "#24005C", fontWeight: "600", fontSize: 16 }]}>
                        {(isSubmitting || isPending) ? "Resetting Password..." : "Reset Password"}
                    </Text>
                </PrimaryButton>
            </FadeInUp>
        </View>
    )
}


const styles = StyleSheet.create({
    resetPasswordForm: {
        width: "100%",
        flexDirection: "column",
        gap: 10
    }
});