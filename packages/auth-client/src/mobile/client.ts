import { expoClient } from "@better-auth/expo/client";
import { AUTH_CONSTANTS } from "@filmato/constants";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { type CreateAuthClientOptions } from "../types/factory.types";

const { PREFIX } = AUTH_CONSTANTS;

export const createMobileAuthClient = ({ baseURL, basePath }: CreateAuthClientOptions) => {
    const auth = createAuthClient({
        baseURL,
        basePath,
        plugins: [
            expoClient({
                scheme: PREFIX,
                storagePrefix: PREFIX,
                cookiePrefix: PREFIX,
                storage: SecureStore
            }),
            emailOTPClient()
        ],
    });

    return auth;
}