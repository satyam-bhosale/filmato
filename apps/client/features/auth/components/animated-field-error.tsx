import { FieldError } from "@shadcn/ui/components/field";
import { AnimatePresence, motion } from "motion/react";
import { ControllerFieldState } from "react-hook-form";

export function MotionFieldError({ error }: Pick<ControllerFieldState, "error">) {
    return (
        <AnimatePresence mode="wait">
            {error?.message && (
                <motion.div
                    key={error.message}
                    layout
                    initial={{ height: 0, opacity: 0, y: -6 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                >
                    <FieldError
                        className="font-medium"
                        errors={[error]}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}