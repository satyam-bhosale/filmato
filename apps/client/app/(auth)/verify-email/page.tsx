"use client"

import { SuspenceFallback } from '@filmato/client/components/suspence-fallback';
import { VerifyEmailForm } from '@filmato/client/features/auth';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<SuspenceFallback />}>
            <VerifyEmailForm />
        </Suspense>
    )
}