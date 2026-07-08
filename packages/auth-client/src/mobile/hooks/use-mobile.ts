import type { MobileAuthClient } from "../../types/auth-client.types";

export function useMobileSession(client: MobileAuthClient ){
    const data = client.useSession();

    return data;
}