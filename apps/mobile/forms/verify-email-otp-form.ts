import { VerifyEmailOtpSchema, type VerifyEmailOtpInput } from "@filmato/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


type UseVerifyEmailOtpForm = {
    onSubmit: (data: VerifyEmailOtpInput) => void | Promise<void>;
}

export function useVerifyEmailOtpForm({ onSubmit }: UseVerifyEmailOtpForm) {
    const form = useForm<VerifyEmailOtpInput>({
        resolver: zodResolver(VerifyEmailOtpSchema),
        mode: "onChange",
        defaultValues: {
            otp: ""
        }
    });

    return {
        ...form,
        handleVerifyEmailOtp: form.handleSubmit(onSubmit),
    }
}