"use client"

import { SuspenceFallback } from "@filmato/client/components/suspence-fallback";
import { SignUpForm } from "@filmato/client/features/auth";
import { Suspense } from "react";

export default function SignUpPage() {
    return (
        <Suspense fallback={<SuspenceFallback />}>
            <SignUpForm />
        </Suspense>
    )
}