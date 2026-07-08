"use client";

import { SuspenceFallback } from "@filmato/client/components/suspence-fallback";
import { ResetPasswordForm } from "@filmato/client/features/auth";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<SuspenceFallback/>}>
            <ResetPasswordForm />
        </Suspense>
    )
}