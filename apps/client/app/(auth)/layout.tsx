"use client"

import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
    return <main className="w-screen h-screen font-sans overflow-hidden lg:p-1.5">
        <div className="w-full h-full rounded-lg flex flex-row gap-2">
            <div className="flex-1 hidden lg:block rounded-xl overflow-hidden">
                <Image
                    src="/images/auth-image.jpg"
                    alt="abstract-purple-color-art"
                    width="1280"
                    height="1920"
                    loading="eager"
                    className="w-full h-full"
                />
            </div>
            <div className="relative flex-1 flex flex-col lg:bg-none bg-cover bg-center">
                <Image
                    src="/images/wordmark.png"
                    alt="Filmato wordmark"
                    width={160}
                    height={40}
                    loading="eager"
                    className="h-auto w-25 sm:w-30 md:w-35 p-2.5 md:p-5 z-20 fixed"
                />
                <div className="w-full h-full flex justify-center items-center z-10">
                    <AnimatePresence mode="wait">
                        {children}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    </main>
}