import { SignUpSchema, type SignUpInput } from "@filmato/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type SignUpFormOptions = {
    onSubmit: (data: SignUpInput) => void | Promise<void>;
}

export function useSignUpForm({onSubmit}:SignUpFormOptions) {
    const form = useForm<SignUpInput>({
        resolver: zodResolver(SignUpSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    return {
        ...form,
        handleSignUp: form.handleSubmit(onSubmit),
    }
}