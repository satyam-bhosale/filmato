import { expo } from "@better-auth/expo";
import env from "@filmato/backend/config/env.js";
import { authLogger } from "@filmato/backend/config/logger.js";
import db from "@filmato/backend/db/index.js";
import { accounts, sessions, users, verifications } from "@filmato/backend/db/schemas/auth.js";
import ResetPasswordOTPTemplate from "@filmato/backend/emails/templates/auth/reset-password-otp.js";
import VerifyEmailOTPTemplate from "@filmato/backend/emails/templates/auth/verify-email-otp.js";
import { hashPassword, verifyPassword } from "@filmato/backend/lib/password.js";
import redis from "@filmato/backend/lib/redis.js";
import resend from "@filmato/backend/lib/resend.js";
import { AUTH_CONSTANTS } from "@filmato/constants";
import { betterAuth, type RateLimit } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { pretty, render } from "react-email";

const { RATELIMIT, PREFIX } = AUTH_CONSTANTS;
const REDIS_PREFIX = `${PREFIX}:auth`;
const RateLimitTTL = {
    auth: 315,
    otp: 915,
    default: 75
}

const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/auth",
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema: { users, sessions, accounts, verifications }
    }),
    plugins: [
        expo(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, type, otp }) {
                if (type === "email-verification") {
                    void resend.emails.send({
                        from: `Filmato <${env.SYSTEM_EMAIL_ID}>`,
                        to: [email],
                        subject: "Verify your Filmato Account",
                        html: await pretty(await render(<VerifyEmailOTPTemplate otp={otp} />))
                    }).then(({ data, error }) => {
                        if (data) authLogger.info(`Verification email sent to: ${email}`)
                        if (error) authLogger.error(`Failed to send verification email to ${email}`);
                    });
                } else if (type === "forget-password") {
                    void resend.emails.send({
                        from: `Filmato <${env.SYSTEM_EMAIL_ID}>`,
                        to: [email],
                        subject: "Reset password of your Filmato account",
                        html: await pretty(await render(<ResetPasswordOTPTemplate otp={otp} />))
                    }).then(({ data, error }) => {
                        if (data) authLogger.info(`Reset password otp email sent to: ${email}`);
                        if (error) authLogger.error(`Failed to send reset password otp email to ${email}`);
                    });
                }
            },

        })
    ],
    trustedOrigins: env.ALLOWED_ORIGINS,
    emailAndPassword: {
        enabled: true,
        password: {
            hash: hashPassword,
            verify: verifyPassword
        },
        requireEmailVerification: true,
        revokeSessionsOnPasswordReset: true,
        resetPasswordTokenExpiresIn: 60 * 10,
    },
    emailVerification: {
        sendOnSignIn: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
            accessType: "offline",
            prompt: "select_account consent",
            redirectURI: `${env.BETTER_AUTH_URL}/auth/callback/google`
        }
    },
    disabledPaths: ["/verify-email", "/request-password-reset", "/change-password", "/send-verification-email"],
    session: {
        storeSessionInDatabase: true,
        preserveSessionInDatabase: true,
        expiresIn: 60 * 60 * 24 * 7,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 15,
            strategy: "jwt"
        },
    },
    rateLimit: {
        enabled: true,
        window: 60,
        max: 250,
        customRules: {
            "/sign-up/*": {
                window: 300,
                max: 5
            },
            "/sign-in/*": {
                window: 300,
                max: 60
            },
            "/email-otp/send-verification-otp": {
                window: RATELIMIT.sendVerificationOtp.window,
                max: RATELIMIT.sendVerificationOtp.max
            },
            "/email-otp/verify-email": {
                window: RATELIMIT.verifyEmailOtp.window,
                max: RATELIMIT.verifyEmailOtp.max
            },
            "/email-otp/request-password-reset": {
                window: RATELIMIT.requestPasswordResetOtp.window,
                max: RATELIMIT.requestPasswordResetOtp.max
            }
        },
        customStorage: {
            get: async (key) => {
                const result = await redis.get(`${REDIS_PREFIX}:${key}`);
                return result as RateLimit;
            },
            set: async (key, value) => {
                let TTL: number;

                if (key.includes("sign-up") || key.includes("sign-in")) {
                    TTL = RateLimitTTL.auth
                } else if (key.includes("verify-email") || key.includes("send-verification-email") || key.includes("request-password-reset")) {
                    TTL = RateLimitTTL.otp
                } else {
                    TTL = RateLimitTTL.default
                }

                await redis.set(`${REDIS_PREFIX}:${key}`, value, { ex: TTL });
            }
        }
    },
    advanced: {
        database: {
            generateId: "uuid"
        },
        cookiePrefix: PREFIX,
        crossSubDomainCookies: {
            enabled: true
        },
        defaultCookieAttributes: {
            sameSite: env.NODE_ENV === "production" ? "none" : "lax",
            secure: env.NODE_ENV === "production",
            httpOnly: true,
        },
    },
    onAPIError: {
        throw: true,
        onError: (error, _ctx) => {
            authLogger.error("Auth Error: ", { error })
        },
        errorURL: "/auth/error"
    },
    logger: {
        level: env.NODE_ENV === 'production' ? 'info' : 'debug',
        log: (level, message, ...args) => {
            switch (level) {
                case "info":
                    authLogger.info(message, { args });
                    break;
                case "warn":
                    authLogger.warn(message, { args });
                    break;
                case "error":
                    authLogger.error(message, { args });
                    break;
                case "debug":
                    authLogger.debug(message, { args });
            }
        }
    }
});

export default auth;