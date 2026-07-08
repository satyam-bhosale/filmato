'use client'

import { useSignIn } from "@filmato/auth-client/shared";
import { fadeInUp } from "@filmato/client/animation/variants/stager-fade";
import { MotionFieldError } from "@filmato/client/features/auth/components/animated-field-error";
import { AuthContainer, AuthContainerContent, AuthContainerDescription, AuthContainerFooter, AuthContainerForm, AuthContainerHeader, AuthContainerTitle } from "@filmato/client/features/auth/components/auth-container";
import { GoogleButton } from "@filmato/client/features/auth/components/google-button";
import { useSignInForm } from "@filmato/client/forms";
import authClient from "@filmato/client/lib/auth/auth-client";
import { PasswordInput } from "@filmato/components";
import { formatDuration, parseDuration } from "@filmato/utils";
import { Button } from "@shadcn/ui/components/button";
import { Checkbox } from "@shadcn/ui/components/checkbox";
import { Field, FieldGroup, FieldLabel } from "@shadcn/ui/components/field";
import { Input } from "@shadcn/ui/components/input";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";


export function SignInForm() {
    const router = useRouter();
    const { signIn } = useSignIn(authClient);
    const { handleSignIn, control, formState: { isSubmitting, isValid } } = useSignInForm({
        onSubmit: ({ email, password, rememberMe }) => {
            toast.promise(
                signIn({ email, password, rememberMe }).then((result) => {
                    if (result.error) throw result.error;
                    return result.data;
                }),
                {
                    loading: "Signing you in...",
                    success: () => {
                        router.replace('/');
                        return "Signed in successfully"
                    },
                    error: (err) => {
                        const retryAfter = err?.retryAfter || 0;
                        if (retryAfter) {
                            return `Too many requests, please try again after ${formatDuration(parseDuration(retryAfter), { format: 'short' })}`
                        }
                        return err?.message ?? "Unable to sign in"
                    }
                }
            );
        }
    })

    return (
        <AuthContainer>
            <AuthContainerHeader>
                <AuthContainerTitle>
                    Sign In
                </AuthContainerTitle>
                <AuthContainerDescription>
                    Welcome back to FilmatO.
                </AuthContainerDescription>
            </AuthContainerHeader>
            <AuthContainerContent className="flex flex-col gap-4">
                <AuthContainerForm onSubmit={handleSignIn}>
                    <FieldGroup>
                        <motion.div
                            variants={fadeInUp}
                            layout
                        >
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { value, onChange }, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="sign-in-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="sign-in-email"
                                            autoComplete="email"
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <MotionFieldError error={fieldState.error} />
                                    </Field>
                                )}
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { value, onChange }, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="sign-in-password">
                                            Password
                                        </FieldLabel>
                                        <PasswordInput
                                            id="sign-in-password"
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <MotionFieldError error={fieldState.error} />
                                        <Link href="/forget-password" className="text-xs font-medium text-right text-muted-foreground hover:text-primary duration-300 ease-in-out">
                                            Forgot password?
                                        </Link>
                                    </Field>
                                )}
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <Controller
                                control={control}
                                name="rememberMe"
                                render={({ field: { value, onChange } }) => (
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id="sign-in-remember-me"
                                            checked={value}
                                            onCheckedChange={(checked) => onChange(!!checked)}
                                        />
                                        <FieldLabel className="text-xs" htmlFor="sign-in-remember-me">
                                            Remember me
                                        </FieldLabel>
                                    </Field>
                                )}
                            />
                        </motion.div>
                    </FieldGroup>
                    <motion.div variants={fadeInUp}>
                        <Button
                            type="submit"
                            className="w-full" size="lg"
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="animate-spin" />}
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>
                    </motion.div>
                </AuthContainerForm>
                <motion.div variants={fadeInUp} className="flex flex-row items-center gap-2">
                    <div className="flex-1 h-px bg-muted-foreground/30" />
                    <div className="text-sm text-muted-foreground/50">
                        OR
                    </div>
                    <div className="flex-1 h-px bg-muted-foreground/30" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                    <GoogleButton mode="signin" />
                </motion.div>
            </AuthContainerContent>
            <AuthContainerFooter>
                <motion.div variants={fadeInUp} className="text-center text-sm">
                    <p>Don't have an account?{" "}
                        <Link href="/sign-up" className="font-semibold">
                            Sign Up
                        </Link>
                    </p>
                </motion.div>
            </AuthContainerFooter>
        </AuthContainer>
    )
}