import { fadeInUp, staggerContainer } from "@filmato/client/animation/variants/stager-fade";
import { cn } from "@shadcn/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function AuthContainer({ children, className = "" }: { children: ReactNode, className?: string }) {
    const shouldReduceMotion = useReducedMotion();
    const pathname = usePathname();
    return (
        <motion.div
            key={pathname}
            className={cn("w-full max-w-md h-fit flex flex-col justify-center gap-6 px-5", className)}
            variants={shouldReduceMotion ? undefined : staggerContainer}
            initial={shouldReduceMotion ? undefined : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
            layout
        >
            <>
                {children}
            </>
        </motion.div>
    );
}

export function AuthContainerHeader({ children, className = "" }: { children: ReactNode, className?: string }) {
        const pathname = usePathname();
    return (
        <div className={cn("w-full h-full flex flex-col justify-center items-start gap-2", className)} key={pathname}>
            <>
                {children}
            </>
        </div>
    );
}

export function AuthContainerTitle({ children, className }: { children: ReactNode, className?: string }) {
    const shouldReduceMotion = useReducedMotion();
    return (
        <motion.h1
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className={cn("font-semibold tracking-tighter text-2xl md:text-3xl", className)}>
            {children}
        </motion.h1>
    );
}

export function AuthContainerDescription({ children, className }: { children: ReactNode, className?: string }) {
    const shouldReduceMotion = useReducedMotion();
    return (
        <motion.p
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className={cn("font-medium tracking-tight text-sm", className)}>
            {children}
        </motion.p>
    );
}

export function AuthContainerContent({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={cn("w-full", className)}>
            {children}
        </div>
    );
}

export function AuthContainerForm({ children, onSubmit, className }: { children: ReactNode, onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void, className?: string }) {
    return (
        <form
            className={cn("w-full flex flex-col gap-4", className)}
            onSubmit={onSubmit}
        >
            {children}
        </form>
    );
}
export function AuthContainerFormField({ children, className }: { children: ReactNode, className?: string }) {
    const shouldReduceMotion = useReducedMotion();
    return (
        <motion.div
            className={cn("w-full flex flex-col gap-4", className)}
            variants={shouldReduceMotion ? undefined : fadeInUp}
        >
            {children}
        </motion.div>
    );
}

export function AuthContainerFooter({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={cn("w-full", className)}>
            {children}
        </div>
    );
}