import { useSignUp } from "@filmato/auth-client/shared";
import FadeInUp from "@filmato/mobile/animation/fade-in-up";
import Input from "@filmato/mobile/components/ui/input";
import PrimaryButton from "@filmato/mobile/components/ui/primary-button";
import SpinningLoader from "@filmato/mobile/components/ui/spinning-loader";
import { useSignUpForm } from "@filmato/mobile/forms";
import authClient from "@filmato/mobile/lib/auth";
import { font } from "@filmato/mobile/theme/fonts";
import { router } from "expo-router";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";

export function SignUpForm() {
    const { signUp, status: { isPending } } = useSignUp(authClient);
    const { handleSignUp, control, reset, formState: { isValid, isSubmitting, errors } } = useSignUpForm({
        onSubmit: ({ email, password }) => {
            toast.promise(
                signUp({ email, password }).then((result) => {
                    if (result.error) throw result.error;
                    return result.data;
                }),
                {
                    loading: "Creating your account...",
                    success: (data) => {
                        const userEmail = data?.user?.email;
                        reset();
                        router.push(`/sign-up/verify?email=${userEmail}`);
                        return "Account created successfully"
                    },
                    error: (err: any) => err?.message ?? "Unable to create your account"
                }
            );
        }
    });

    return (
        <View style={styles.signUpForm}>
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
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <Input
                            label="Confirm Password"
                            placeholder="Confirm Password"
                            isPassword={true}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            error={errors.confirmPassword?.message}
                        />
                    )}
                />
            </FadeInUp>

            <FadeInUp delay={550}>
                <PrimaryButton
                    onPress={handleSignUp}
                    disabled={!isValid || isSubmitting || isPending}
                >
                    {(isValid && (isSubmitting || isPending)) && (
                        <SpinningLoader size={18} color="#24005C" />
                    )}

                    <Text
                        style={[
                            font.bold,
                            {
                                color: "#24005C",
                                fontWeight: "600",
                                fontSize: 16
                            }
                        ]}
                    >
                        Create Account
                    </Text>
                </PrimaryButton>
            </FadeInUp>
        </View>
    );
}


const styles = StyleSheet.create({
    signUpForm: {
        width: "100%",
        flexDirection: "column",
        gap: 10
    }
});