"use client"

import { useRequestPasswordResetOtp } from "@filmato/auth-client/shared";
import { fadeInUp } from "@filmato/client/animation/variants/stager-fade";
import { MotionFieldError } from "@filmato/client/features/auth/components/animated-field-error";
import { AuthContainer, AuthContainerContent, AuthContainerDescription, AuthContainerForm, AuthContainerHeader, AuthContainerTitle } from "@filmato/client/features/auth/components/auth-container";
import { useRequestPasswordResetOtpForm } from "@filmato/client/forms";
import authClient from "@filmato/client/lib/auth/auth-client";
import { formatDuration, parseDuration } from "@filmato/utils";
import { Button } from "@shadcn/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@shadcn/ui/components/field";
import { Input } from "@shadcn/ui/components/input";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export function RequestPasswordResetForm() {
    const router = useRouter(); 
    const { requestPasswordResetOtp, status: { isPending } } = useRequestPasswordResetOtp(authClient);
    const { handleForgetPassword, control, reset, formState: { isValid } } = useRequestPasswordResetOtpForm({
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
                error: (err) => {
                    if(err?.retryAfter) return `Too many requests, please try again after ${formatDuration(parseDuration(err?.retryAfter), {format: 'short'})}`;

                    return err?.message ?? 'Unable to send password reset code'
                }
            })
        }
    });

    return (
        <AuthContainer>
            <AuthContainerHeader>
                <AuthContainerTitle>
                    Forgot Password
                </AuthContainerTitle>
                <AuthContainerDescription>
                    Enter your email address to receive a password reset code.
                </AuthContainerDescription>
            </AuthContainerHeader>
            <AuthContainerContent>
                <AuthContainerForm onSubmit={handleForgetPassword}>
                    <FieldGroup>
                        <motion.div variants={fadeInUp}>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { value, onChange }, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="request-reset-password-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="request-reset-password-email"
                                            autoComplete="email"
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
                            className="w-full" size="lg"
                            disabled={!isValid || isPending}
                        >
                            {isPending && <Loader2 className="animate-spin" />}
                            {isPending ? "Sending Code..." : "Send Reset Code"}
                        </Button>
                    </motion.div>
                </AuthContainerForm>
            </AuthContainerContent>
        </AuthContainer>
    )
}