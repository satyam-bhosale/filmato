import { useSignIn } from "@filmato/auth-client/shared";
import FadeInUp from "@filmato/mobile/animation/fade-in-up";
import Input from "@filmato/mobile/components/ui/input";
import PrimaryButton from "@filmato/mobile/components/ui/primary-button";
import SpinningLoader from "@filmato/mobile/components/ui/spinning-loader";
import { useSignInForm } from "@filmato/mobile/forms";
import authClient from "@filmato/mobile/lib/auth";
import { useTheme } from "@filmato/mobile/store/theme";
import { font } from "@filmato/mobile/theme/fonts";
import { formatDuration, parseDuration } from "@filmato/utils";
import { router } from "expo-router";
import { Controller } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";

export function SignInForm() {
    const { colors } = useTheme();
    const { signIn, status: { isPending } } = useSignIn(authClient);
    const { handleSignIn, control, reset, formState: { isValid, isSubmitting, errors } } = useSignInForm({
        onSubmit: ({ email, password}) => {
            toast.promise(signIn({ email, password, rememberMe: true }).then((result) => {
                if (result.error) throw result.error;
                return result.data;
            }), {
                loading: "Signing you in...",
                success: () => {
                    reset();
                    router.replace('/');
                    return "Signed in successfully"
                },
                error: (err: any) => {
                    const retryAfter = err?.retryAfter || 0;
                    if (retryAfter) {
                        return `Too many requests, please try again after ${formatDuration(parseDuration(retryAfter), { format: 'short' })}`
                    }
                    return err?.message ?? "Unable to sign in"
                }
            })
        }
    });

    return (
        <View style={styles.signInForm}>
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
            <FadeInUp delay={350}>
                <Controller
                    name="password"
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <Input
                            label="Password"
                            placeholder="Password"
                            isPassword={true}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            error={errors.password?.message}
                        />
                    )}
                />
            </FadeInUp>
            <FadeInUp delay={450}>
                <Pressable
                    style={[{ flex: 1, flexDirection: "row", justifyContent: "flex-end", paddingVertical: 5 }]}
                    onPress={() => router.push("/forget-password")}
                >
                    <Text style={[font.medium, { color: colors.textPrimary }]}>Forgot Password ?</Text>
                </Pressable>
            </FadeInUp>
            <FadeInUp delay={550}>
                <PrimaryButton
                    onPress={handleSignIn}
                    disabled={!isValid || isSubmitting || isPending}
                >
                    {(isValid && (isSubmitting || isPending)) && <SpinningLoader size={18} color="#24005C" />}
                    <Text style={[font.bold, { color: "#24005C", fontWeight: "600", fontSize: 16 }]}>
                        Continue
                    </Text>
                </PrimaryButton>
            </FadeInUp>
        </View>
    );
}

const styles = StyleSheet.create({
    signInForm: {
        width: "100%",
        flexDirection: "column",
        gap: 10
    }
});