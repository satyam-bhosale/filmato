import type { createMobileAuthClient } from "../mobile";
import { createWebAuthClient } from "../web/client";

export type WebAuthClient = ReturnType<typeof createWebAuthClient>;
export type MobileAuthClient = ReturnType<typeof createMobileAuthClient>;

export type WebAndMobileAuthClient = WebAuthClient | MobileAuthClient;