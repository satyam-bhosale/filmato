"use client";

import { useRequestPasswordResetOtp, useResetPasswordOtp } from "@filmato/auth-client/shared";
import { MotionFieldError } from "@filmato/client/features/auth/components/animated-field-error";
import { AuthContainer, AuthContainerContent, AuthContainerDescription, AuthContainerFooter, AuthContainerForm, AuthContainerFormField, AuthContainerHeader, AuthContainerTitle } from "@filmato/client/features/auth/components/auth-container";
import { EmailParamError } from "@filmato/client/features/auth/components/email-param-error";
import { useResetPasswordOtpForm } from "@filmato/client/forms";
import authClient from "@filmato/client/lib/auth/auth-client";
import { PasswordInput } from "@filmato/components";
import { AUTH_CONSTANTS } from "@filmato/constants";
import { useResend } from "@filmato/hooks";
import { formatDuration, parseDuration } from "@filmato/utils";
import { Button } from "@shadcn/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@shadcn/ui/components/field";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@shadcn/ui/components/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userEmail = searchParams.get('email');
    const { resetPasswordOtp, status: { isPending } } = useResetPasswordOtp(authClient);
    const { handleResetPassword, control, reset, formState: { isValid, isSubmitting } } = useResetPasswordOtpForm({
        onSubmit: ({ confirmNewPassword, otp }) => {
            toast.promise(resetPasswordOtp({ email: userEmail!, password: confirmNewPassword, otp }).then((result => {
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
                error: (err) => {
                    if (err?.retryAfter) {
                        return `Too many requests, please try again after ${err?.retryAfter}`;
                    }

                    return err?.message ?? "Unable to reset your password"
                }
            })
        }
    });


    if (!userEmail) {
        return <EmailParamError
            label="Sign up"
            action={() => router.replace("/sign-up")}
        />;
    }

    return (
        <AuthContainer>
            <AuthContainerHeader>
                <AuthContainerTitle>
                    Reset Password
                </AuthContainerTitle>
                <AuthContainerDescription>
                    Reset password verification code sent to <span className="text-yellow-300">{userEmail}</span>
                </AuthContainerDescription>
            </AuthContainerHeader>
            <AuthContainerContent>
                <AuthContainerForm onSubmit={handleResetPassword}>
                    <FieldGroup>
                        <AuthContainerFormField>
                            <Controller
                                control={control}
                                name="newPassword"
                                render={({ field: { value, onChange }, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="reset-new-password">
                                            New Password
                                        </FieldLabel>
                                        <PasswordInput
                                            id="reset-new-password"
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <MotionFieldError error={fieldState.error} />
                                    </Field>
                                )}
                            />
                        </AuthContainerFormField>
                        <AuthContainerFormField>
                            <Controller
                                control={control}
                                name="confirmNewPassword"
                                render={({ field: { value, onChange }, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="reset-confirm-new-password">
                                            Confirm New Password
                                        </FieldLabel>
                                        <PasswordInput
                                            id="reset-confirm-new-password"
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <MotionFieldError error={fieldState.error} />
                                    </Field>
                                )}
                            />
                        </AuthContainerFormField>
                        <AuthContainerFormField>
                            <Controller
                                control={control}
                                name="otp"
                                render={({ field: { value, onChange }, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="reset-password-otp">
                                            Verification OTP
                                        </FieldLabel>
                                        <div className="w-full h-fit flex flex-row items-center justify-center py-2.5 gap-3">
                                            <InputOTP
                                                id="reset-password-otp"
                                                maxLength={6}
                                                value={value}
                                                onChange={onChange}
                                                pattern={REGEXP_ONLY_DIGITS}
                                            >
                                                <InputOTPGroup className="
                                                *:data-[slot=input-otp-slot]:h-12
                                                *:data-[slot=input-otp-slot]:w-12
                                                *:data-[slot=input-otp-slot]:text-xl
                                                ">
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup className="
                                                *:data-[slot=input-otp-slot]:h-12
                                                *:data-[slot=input-otp-slot]:w-12
                                                *:data-[slot=input-otp-slot]:text-xl
                                                ">
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                        <MotionFieldError error={fieldState.error} />
                                    </Field>
                                )}

                            />
                        </AuthContainerFormField>
                    </FieldGroup>
                    <AuthContainerFormField className="w-full">
                        <Button
                            type="submit"
                            size="lg"
                            className="font-semibold w-full"
                            disabled={!isValid || isSubmitting || isPending}
                        >
                            {(isSubmitting || isPending) && (
                                <Loader2 className="animate-spin" />
                            )}

                            {(isSubmitting || isPending)
                                ? "Resetting Password..."
                                : "Reset Password"}
                        </Button>
                    </AuthContainerFormField>
                </AuthContainerForm>
            </AuthContainerContent>
            <AuthContainerFooter>
                <ResendRequestResetPasswordOtp email={userEmail} />
            </AuthContainerFooter>
        </AuthContainer>
    )
}

function ResendRequestResetPasswordOtp({ email }: { email: string }) {
    const { RATELIMIT: { requestPasswordResetOtp: { window, max } } } = AUTH_CONSTANTS;
    const COOLDOWN = window / max;
    const { requestPasswordResetOtp, status: { isPending } } = useRequestPasswordResetOtp(authClient);
    const { resend, remainingTime, isCooling } = useResend({
        cooldown: COOLDOWN,
        action: () => requestPasswordResetOtp({ email }),
        onSuccess: () => toast.success(`Sent verification code at ${email}`),
        onError: (error) => {
            if (error) {
                if (error?.retryAfter) {
                    toast.error(`Too many requests, please try again after ${formatDuration(parseDuration(error?.retryAfter), { format: 'short' })}`);
                } else {
                    toast.error(error?.message);
                }

            }
        }
    });

    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <p>Didn't recieve the code?{" "}</p>
            {
                isCooling ? <p className="font-semibold">{formatDuration(parseDuration(remainingTime), { format: 'digital', includeZeroValues: false })}</p> :
                    <Button
                        size="xs"
                        variant="outline"
                        disabled={isCooling || isPending}
                        onClick={resend}
                    >
                        {isPending && <Loader2 className="animate-spin" />}
                        {isPending ? "Sending..." : "Resend"}
                    </Button>
            }
        </div>
    )

}