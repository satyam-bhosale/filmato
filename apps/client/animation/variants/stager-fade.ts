import { Variants } from "motion";

export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12
        }
    },
};

export const fadeInUp : Variants = {
    hidden: {
        opacity: 0,
        y: 10
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    }
};