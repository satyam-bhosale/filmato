import { AUTH_CONSTANTS } from "@filmato/constants";
import * as z from "zod";

const { OTP_LENGTH } = AUTH_CONSTANTS

const EmailSchema = () => z.email({ error: (issue) => (issue.input === undefined || issue.input === "") ? "Email address is required" : "Invalid Email address" });

const PasswordSchema = () => z.string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, { error: "Must contain an uppercase letter" })
    .regex(/[a-z]/, { error: "Must contain a lowercase letter" })
    .regex(/[0-9]/, { error: "Must contain a digit" })
    .regex(/[^A-Za-z0-9]/, { error: "Must contain at least one special character" });

const OTPSchema = () => z.string({ error: "OTP is required" })
    .length(OTP_LENGTH, { error: `OTP must be ${OTP_LENGTH} digits` })
    .regex(/^\d+$/, { error: "OTP must contain only numbers" })

export const SignInSchema = z.strictObject({
    email: EmailSchema(),
    password: PasswordSchema(),
    rememberMe: z.boolean().optional()
});

export const SignUpSchema = z.strictObject({
    email: EmailSchema(),
    password: PasswordSchema(),
    confirmPassword: z.string({ error: "Confirm password is required" })
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: "Passwords do not match"
        })
    }
});

export const VerifyEmailOtpSchema = z.strictObject({
    otp: OTPSchema(),
});

export const RequestPasswordResetOtpSchema = z.strictObject({
    email: EmailSchema(),
});

export const ResetPasswordOtpSchema = z.strictObject({
    newPassword: PasswordSchema(),
    confirmNewPassword: z.string({ error: "Confirm new password is required" }),
    otp: OTPSchema()
}).superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
        ctx.addIssue({
            code: "custom",
            path: ["confirmNewPassword"],
            message: "Passwords do not match"
        })
    }
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type VerifyEmailOtpInput = z.infer<typeof VerifyEmailOtpSchema>;
export type RequestPasswordResetOtpInput = z.infer<typeof RequestPasswordResetOtpSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordOtpSchema>;

