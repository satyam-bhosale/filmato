import { RequestPasswordResetOtpSchema, type RequestPasswordResetOtpInput } from "@filmato/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type UseRequestPasswordResetFormType = {
    onSubmit: (data: RequestPasswordResetOtpInput) => void | Promise<void>;
}

export function useRequestPasswordResetOtpForm({ onSubmit }: UseRequestPasswordResetFormType) {
    const form = useForm<RequestPasswordResetOtpInput>({
        resolver: zodResolver(RequestPasswordResetOtpSchema),
        mode: "onChange",
        defaultValues: {
            email: ""
        }
    });

    return {
        ...form,
        handleForgetPassword: form.handleSubmit(onSubmit),
    }
}