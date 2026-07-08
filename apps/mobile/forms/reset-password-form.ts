import { type ResetPasswordInput, ResetPasswordOtpSchema } from "@filmato/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


type UseResetPasswordFormOptions = {
    onSubmit: (data: ResetPasswordInput) => void | Promise<void>;
};

export function useResetPasswordOtpForm({ onSubmit }: UseResetPasswordFormOptions) {
    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(ResetPasswordOtpSchema),
        mode: "onChange",
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
            otp: ""
        }
    });

    return {
        ...form,
        handleResetPassword: form.handleSubmit(onSubmit),
    }
}