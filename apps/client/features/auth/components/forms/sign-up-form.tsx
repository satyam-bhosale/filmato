"use client"

import { useSignUp } from "@filmato/auth-client/shared";
import { fadeInUp } from "@filmato/client/animation/variants/stager-fade";
import { AlternateAuthDivider } from "@filmato/client/features/auth/components/alternate-auth-divider";
import { MotionFieldError } from "@filmato/client/features/auth/components/animated-field-error";
import { AuthContainer, AuthContainerContent, AuthContainerDescription, AuthContainerFooter, AuthContainerForm, AuthContainerHeader, AuthContainerTitle } from "@filmato/client/features/auth/components/auth-container";
import { GoogleButton } from "@filmato/client/features/auth/components/google-button";
import { useSignUpForm } from "@filmato/client/forms";
import authClient from "@filmato/client/lib/auth/auth-client";
import { PasswordInput } from "@filmato/components";
import { Button } from "@shadcn/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@shadcn/ui/components/field";
import { Input } from "@shadcn/ui/components/input";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export function SignUpForm() {
    const router = useRouter();
    const { signUp } = useSignUp(authClient);
    const { handleSignUp, control, formState: { isSubmitting, isValid } } = useSignUpForm({
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
                        router.replace(`/verify-email?email=${userEmail}`);
                        return "Account created successfully";
                    },
                    error: (err) => err?.message ?? "Unable to create your account"
                }
            );
        }
    })

    return (
            <AuthContainer>
                <AuthContainerHeader>
                    <AuthContainerTitle>
                        Create Account
                    </AuthContainerTitle>
                    <AuthContainerDescription>
                        Welcome to FilmatO.
                    </AuthContainerDescription>
                </AuthContainerHeader>
                <AuthContainerContent className="flex flex-col gap-4">
                    <AuthContainerForm onSubmit={handleSignUp}>
                        <FieldGroup>
                            <motion.div variants={fadeInUp}>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { value, onChange }, fieldState }) => (
                                        <Field>
                                            <FieldLabel htmlFor="sign-up-email">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                id="sign-up-email"
                                                value={value}
                                                onChange={onChange}
                                                autoComplete="email"
                                                type="email"
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
                                            <FieldLabel htmlFor="sign-up-password">
                                                Password
                                            </FieldLabel>
                                            <PasswordInput
                                                id="sign-up-password"
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
                                    name="confirmPassword"
                                    render={({ field: { value, onChange }, fieldState }) => (
                                        <Field>
                                            <FieldLabel htmlFor="sign-up-confirm-password">
                                                Confirm Password
                                            </FieldLabel>
                                            <PasswordInput
                                                id="sign-up-confirm-password"
                                                value={value}
                                                onChange={onChange}
                                            />
                                            <MotionFieldError error={fieldState.error} />
                                        </Field>
                                    )}
                                />
                            </motion.div>
                        </FieldGroup>
                        <motion.div variants={fadeInUp}>
                            <Button
                                type="submit"
                                className="w-full font-semibold"
                                size="lg"
                                disabled={!isValid || isSubmitting}
                            >
                                {isSubmitting && <Loader2 className="animate-spin" />}
                                {isSubmitting ? "Signing Up..." : "Sign Up"}
                            </Button>
                        </motion.div>
                    </AuthContainerForm>
                    <motion.div variants={fadeInUp} className="flex flex-row items-center gap-2">
                        <AlternateAuthDivider />
                    </motion.div>
                    <motion.div variants={fadeInUp} className="w-full flex flex-row justify-center">
                        <GoogleButton mode="signup" />
                    </motion.div>
                </AuthContainerContent>
                <AuthContainerFooter>
                    <motion.div variants={fadeInUp} className="text-center text-sm">
                        <p>Already have an account?{" "}
                            <Link href="/sign-in" className="font-semibold">
                                Sign In
                            </Link>
                        </p>
                    </motion.div>
                </AuthContainerFooter>
            </AuthContainer>
    )
}