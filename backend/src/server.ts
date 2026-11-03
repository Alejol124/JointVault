import { serve } from "@hono/node-server";
import app from "./app.js";
import "dotenv/config";

// Cargamos las variables de entorno desde el archivo .env
    
// Definimos el puerto
const port = parseInt(process.env.PORT || '3000');

// Inicia el servidor pasando la aplicación y mostrando el mensaje en consola
serve({
    fetch: app.fetch,
    port: port,
}, (info) => {
    console.log(`Server running on http://localhost:${info.port}`);
});