import app from "@filmato/backend/app.js";
import env from "@filmato/backend/config/env.js";
import { appLogger } from "@filmato/backend/config/logger.js";
import os from "node:os";

function getLocalIpAddresses(): string[] {
    const interfaces = os.networkInterfaces();
    const ipAddresses: string[] = [];
    
    for (const interfaceName in interfaces) {
        const addresses = interfaces[interfaceName];
        if (!addresses) continue; 
        for (const config of addresses) {
            if (config.family === 'IPv4' && !config.internal) {
                ipAddresses.push(config.address);
            }
        }
    }

    return ipAddresses;
}

const localIpAddresses = getLocalIpAddresses();

app.listen(env.PORT, () => {
    if (localIpAddresses.length === 0) {
        appLogger.info(`Filmato API is running on http://localhost:${env.PORT}`);
        return;
    }

    const formattedUrls = localIpAddresses
        .map((address) => `\nhttp://${address}:${env.PORT}`)
        .join("");

    appLogger.info(`Filmato API is running on:\nhttp://localhost:${env.PORT}${formattedUrls}`);
});
