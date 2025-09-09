import { app } from "./app.ts";

const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 3000);

const server = app.listen(port, host, () => {
  console.log(`[server] listening on http://${host}:${port}`);
});

process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());

export default server;
