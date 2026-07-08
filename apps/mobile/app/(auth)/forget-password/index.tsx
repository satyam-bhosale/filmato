import { AuthFormCard, AuthFormContent, AuthFormDescription, AuthFormHeader, AuthFormTitle, RequestPasswordResetForm } from "@filmato/mobile/features/auth";
import { fontSize } from "@filmato/mobile/theme/fonts";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function RequestPasswordResetScreen() {
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
                            <AuthFormTitle style={[fontSize["2xl"]]}>
                                Forgot Password
                            </AuthFormTitle>
                            <AuthFormDescription>
                                 Enter your email address to receive a password reset code.
                            </AuthFormDescription>
                        </AuthFormHeader>
                        <AuthFormContent style={{ flexDirection: "column", gap: 10 }}>
                            <RequestPasswordResetForm />
                        </AuthFormContent>
                    </AuthFormCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
})