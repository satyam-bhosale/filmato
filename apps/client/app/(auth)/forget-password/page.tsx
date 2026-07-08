"use client"

import { SuspenceFallback } from "@filmato/client/components/suspence-fallback";
import { RequestPasswordResetForm } from "@filmato/client/features/auth";
import { Suspense } from "react";

export default function ForgetPasswordPage() {
    return (
        <Suspense fallback={<SuspenceFallback />}>
            <RequestPasswordResetForm />
        </Suspense>
    )
}