import { createWebAuthClient } from "@filmato/auth-client/web";

const authClient = createWebAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
    basePath: "/auth"
})

export default authClient;