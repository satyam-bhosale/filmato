import { createMobileAuthClient } from "@filmato/auth-client/mobile";

const authClient = createMobileAuthClient({
    baseURL: process.env.EXPO_PUBLIC_API_URL!,
    basePath: "/auth"
});

export default authClient;