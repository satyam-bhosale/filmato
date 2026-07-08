import { useRequestPasswordResetOtp } from "@filmato/auth-client/shared";
import FadeInUp from "@filmato/mobile/animation/fade-in-up";
import Input from "@filmato/mobile/components/ui/input";
import PrimaryButton from "@filmato/mobile/components/ui/primary-button";
import SpinningLoader from "@filmato/mobile/components/ui/spinning-loader";
import { useRequestPasswordResetOtpForm } from "@filmato/mobile/forms";
import authClient from "@filmato/mobile/lib/auth";
import { font } from "@filmato/mobile/theme/fonts";
import { formatDuration, parseDuration } from "@filmato/utils";
import { router } from "expo-router";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";

export function RequestPasswordResetForm() {
    const {requestPasswordResetOtp, status:{isPending}} = useRequestPasswordResetOtp(authClient)
    const {handleForgetPassword, control, reset, formState:{isValid, isSubmitting, errors}} = useRequestPasswordResetOtpForm({
        onSubmit: ({ email }) => {
            toast.promise(requestPasswordResetOtp({ email }).then((result) => {
                if (result.error) throw result.error;
                return result.data;
            }), {
                loading: 'Sending password reset code...',
                success:() => {
                    reset();
                    router.push(`/reset-password?email=${email}`);

                    return `Password reset code sent`
                },
                error: (err : any) => {
                    if(err?.retryAfter) return `Too many requests, please try again after ${formatDuration(parseDuration(err?.retryAfter), {format: 'short'})}`;

                    return 'Unable to send password reset code'
                }
            })
        }
    })

    return (
        <View style={styles.requestPasswordResetForm}>
            <FadeInUp delay={250}>
                <Controller
                    name="email"
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <Input
                            label="Email"
                            placeholder="Email"
                            inputMode="email"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.email?.message}
                        />
                    )}
                />
            </FadeInUp>
            <FadeInUp delay={550}>
                <PrimaryButton
                    onPress={handleForgetPassword}
                    disabled={!isValid || isSubmitting || isPending}
                >
                    {(isSubmitting || isPending) && <SpinningLoader size={18} color="#24005C" />}
                    <Text style={[font.bold, { color: "#24005C", fontWeight: "600", fontSize: 16 }]}>
                        {isPending ? "Sending Code..." : "Send Reset Code"}
                    </Text>
                </PrimaryButton>
            </FadeInUp>
        </View>
    )
}

const styles = StyleSheet.create({
    requestPasswordResetForm: {
        width: "100%",
        flexDirection: "column",
        gap: 10
    }
});