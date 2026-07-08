import FadeInUp from "@filmato/mobile/animation/fade-in-up";
import { AuthFormCard, AuthFormContent, AuthFormDescription, AuthFormHeader, AuthFormTitle } from "@filmato/mobile/features/auth/components/auth-form-card";
import { SignUpForm } from "@filmato/mobile/features/auth/components/forms/sign-up-form";
import GoogleButton from "@filmato/mobile/features/auth/components/google-button";
import { useTheme } from "@filmato/mobile/store/theme";
import { font, fontSize } from "@filmato/mobile/theme/fonts";
import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
    const { colors } = useTheme();
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
                    contentContainerStyle={[styles.scrollViewContainer]}
                    keyboardShouldPersistTaps="handled"
                >
                    <AuthFormCard>
                        <AuthFormHeader>
                            <AuthFormTitle>
                                Create Account
                            </AuthFormTitle>
                            <AuthFormDescription>
                                Welcome to FilmatO.
                            </AuthFormDescription>
                        </AuthFormHeader>
                        <AuthFormContent style={[{ flexDirection: "column", gap: 10 }]}>
                            <SignUpForm />
                            <FadeInUp delay={650}>
                                <GoogleButton mode="sign-up" />
                            </FadeInUp>
                            <View style={{ width: "100%", alignItems: "center", paddingTop: 10 }}>
                                <Text
                                    style={[font.medium, fontSize.sm, { color: colors.textPrimary }]}
                                    onPress={() => router.push("/sign-in")}
                                >
                                    Already have an account?{" "}
                                    <Text style={[font.semibold, { color: colors.accentLight }]}>
                                        Sign In
                                    </Text>
                                </Text>
                            </View>
                        </AuthFormContent>
                    </AuthFormCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
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