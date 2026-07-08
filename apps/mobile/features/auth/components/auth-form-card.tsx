import FadeInUp from "@filmato/mobile/animation/fade-in-up";
import { useTheme } from "@filmato/mobile/store/theme";
import { font, fontSize, letterSpacing } from "@filmato/mobile/theme/fonts";
import { ReactNode } from "react";
import { Image, StyleSheet, Text, TextProps, View, ViewProps } from "react-native";

type AuthFormCardProps = ViewProps & {
    children: ReactNode,
}

type AuthFormHeaderProps = ViewProps & {
    children: ReactNode;
}

type AuthFormTitleProps = TextProps & {
    children: string;
}

type AuthFormDescriptionProps = TextProps & {
    children: string;
}

type AuthFormContentProps = ViewProps & {
    children: ReactNode;
}

function AuthFormCard({ children, style, ...rest }: AuthFormCardProps) {
    return (
        <View style={[styles.formCard, style]} {...rest}>
            {children}
        </View>
    )
}

function AuthFormHeader({ children, style, ...rest }: AuthFormHeaderProps) {
    return (
        <View style={[styles.header, style]} {...rest}>
            <FadeInUp>
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={require("../../../assets/images/logo-wordmark.png")}
                />
            </FadeInUp>
            <FadeInUp delay={150}>
            {children}
            </FadeInUp>
        </View>
    );
}

function AuthFormTitle({ children, style, ...rest }: AuthFormTitleProps) {
    const { colors } = useTheme();
    return (
        <Text style={[styles.title, fontSize["3xl"], font.semibold, { color: colors.textPrimary }, letterSpacing.tighter, style]} {...rest}>
            {children}
        </Text>
    );
}

function AuthFormDescription({ children, style, ...rest }: AuthFormDescriptionProps) {
    const { colors } = useTheme();
    return (
        <Text style={[styles.description, fontSize.sm, font.medium, { color: colors.textPrimary }, letterSpacing.tighter, style]} {...rest}>
            {children}
        </Text>
    );

}

function AuthFormContent({ children, style, ...rest }: AuthFormContentProps) {
    return (
        <View style={[styles.content, style]} {...rest}>
            {children}
        </View>
    );
}

export { AuthFormCard, AuthFormContent, AuthFormDescription, AuthFormHeader, AuthFormTitle };

const styles = StyleSheet.create({
    formCard: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 20,
        flexDirection: "column",
        gap: 18,
        justifyContent: "space-between"
    },
    header: {
        width: "100%",
        flexDirection: "column",
        gap: 4
    },
    logo: {
        width: 70,
        height: 25
    },
    title: {
        width: "100%",
        lineHeight: 50
    },
    description: {
        width: "100%",
    },
    content: {
        width: "100%"
    }
});