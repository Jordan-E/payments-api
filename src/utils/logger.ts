import pino from "pino";

const transport = pino.transport({
  targets: [
    { target: "pino-pretty", options: { destination: 1 } },
    {
      target: "pino/file",
      options: { destination: "logs/app.log", mkdir: true },
    },
  ],
});

export const logger = pino(transport);
