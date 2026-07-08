"use client"

import { useSendVerificationOtp, useVerifyEmailOtp } from "@filmato/auth-client/shared";
import { fadeInUp } from "@filmato/client/animation/variants/stager-fade";
import { MotionFieldError } from "@filmato/client/features/auth/components/animated-field-error";
import { AuthContainer, AuthContainerContent, AuthContainerDescription, AuthContainerFooter, AuthContainerForm, AuthContainerHeader, AuthContainerTitle } from "@filmato/client/features/auth/components/auth-container";
import { EmailParamError } from "@filmato/client/features/auth/components/email-param-error";
import { useVerifyEmailOtpForm } from "@filmato/client/forms";
import authClient from "@filmato/client/lib/auth/auth-client";
import { AUTH_CONSTANTS } from "@filmato/constants";
import { useResend } from "@filmato/hooks";
import { formatDuration, parseDuration } from "@filmato/utils";
import { Button } from "@shadcn/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@shadcn/ui/components/field";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@shadcn/ui/components/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userEmail = searchParams.get('email');
    const { verifyEmailOtp, status: { isPending } } = useVerifyEmailOtp(authClient);
    const { handleVerifyEmailOtp, control, formState: { isValid } } = useVerifyEmailOtpForm({
        onSubmit: ({ otp }) => {
            toast.promise(verifyEmailOtp({
                email: userEmail!,
                otp,
            }).then((result) => {
                if (result.error) throw result.error;
                return result.data;
            }), {
                loading: "Verifying your email...",
                success: () => {
                    router.replace('/');
                    return 'Verification was successful'
                },
                error: (error) => error?.message ?? "Failed to verify email"
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
                    Verify your email
                </AuthContainerTitle>
                <AuthContainerDescription>
                    We sent a 6-digit code to <span className="text-yellow-300">{userEmail}</span>.
                </AuthContainerDescription>
            </AuthContainerHeader>
            <AuthContainerContent>
                <AuthContainerForm onSubmit={handleVerifyEmailOtp}>
                    <FieldGroup>

                        <motion.div
                            variants={fadeInUp}
                            layout
                        >
                            <Controller
                                control={control}
                                name="otp"
                                render={({ field: { value, onChange }, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="verification-otp">
                                            Verification OTP
                                        </FieldLabel>
                                        <div className="w-full h-fit flex flex-row items-center justify-center py-2.5 gap-3">
                                            <InputOTP
                                                id="verification-otp"
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
                        </motion.div>
                    </FieldGroup>
                    <motion.div variants={fadeInUp}>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={!isValid || isPending}
                            className="w-full"
                        >
                            {isPending && <Loader2 className="animate-spin" />}
                            {isPending ? "Verifying" : "Verify"}
                        </Button>
                    </motion.div>
                </AuthContainerForm>
            </AuthContainerContent>
            <AuthContainerFooter>
                <motion.div variants={fadeInUp} className="text-center text-sm">
                    <ResendVerificationOtp email={userEmail} />
                </motion.div>
            </AuthContainerFooter>
        </AuthContainer>
    )
}

function ResendVerificationOtp({ email }: { email: string }) {
    const { RATELIMIT: { sendVerificationOtp: { window, max } } } = AUTH_CONSTANTS
    const COOLDOWN = window / max;
    const { sendVerificationOtp, status: { isPending } } = useSendVerificationOtp(authClient);
    const { resend, remainingTime, isCooling } = useResend({
        cooldown: COOLDOWN,
        action: () => sendVerificationOtp({ email }),
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