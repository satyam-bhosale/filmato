import env from "@filmato/backend/config/env.js";
import type { CorsOptions } from "cors";

const CORS_OPTIONS : CorsOptions = {
    origin: env.ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["x-retry-after"]
}

export default CORS_OPTIONS;