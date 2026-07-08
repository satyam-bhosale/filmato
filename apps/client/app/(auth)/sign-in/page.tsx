'use client'

import { SuspenceFallback } from "@filmato/client/components/suspence-fallback";
import { SignInForm } from "@filmato/client/features/auth";
import { Suspense } from "react";


export default function SignInPage() {
    return (
        <Suspense fallback={<SuspenceFallback/>}>
            <SignInForm />
        </Suspense>
    )
}