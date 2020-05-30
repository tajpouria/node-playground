import { createLogger, format, transports } from "winston";

export const Logger = (logDir: string) =>
  createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
    ),
    transports: [
      new transports.File({
        filename: `${logDir}/service-error.log`,
        level: "error",
      }),
      new transports.File({
        filename: `${logDir}/service-combined.log`,
      }),
      new transports.Console({
        format: format.simple(),
      }),
    ],
  });
