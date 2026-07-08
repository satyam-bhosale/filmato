import { configure, getConsoleSink, getJsonLinesFormatter, getLogger } from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";
import env from "../config/env.js";

export async function initLogger() {
    const lowestLevel = env.NODE_ENV === 'production' ? 'info' : 'debug';
        await configure({
            sinks: {
                console: getConsoleSink({
                    formatter: (env.NODE_ENV === 'development') ? getPrettyFormatter({
                        timestamp: "date-time-timezone",
                        timestampStyle: ["dim", "italic"],
                        categoryStyle: "dim",
                        categorySeparator: ".",
                        icons: false,
                        level: "FULL",
                        levelStyle: "bold"
                    }) : getJsonLinesFormatter({
                        categorySeparator: "."
                    })
                })
            },
            loggers: [
                { category: ["logtape", "meta"], sinks: ["console"], lowestLevel: "warning" },
                { category: ["app"], sinks: ["console"], lowestLevel: lowestLevel }
            ]
        });
}

export const appLogger = getLogger(["app"]);
export const authLogger = getLogger(["app", "auth"]);