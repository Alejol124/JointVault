import { serve } from "@hono/node-server";
import { appConfig } from "./config/env.js";
const { PORT } = appConfig;
import app from "./app.js";


// Inicia el servidor pasando la aplicación y mostrando el mensaje en consola
serve({
    fetch: app.fetch,
    port: PORT,
}, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

