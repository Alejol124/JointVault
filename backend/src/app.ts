//app.ts Represent the application and does not depend on an open port. This will allow us to test routes directly using Hono's testing API.
import { Hono } from 'hono';
import franchiseRouter from './modules/franchises/franchise.routes.js';

//Main application instance
const app = new Hono();

//ruta health
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.route("/api/franchises", franchiseRouter);

// Handler for routes that does not exist
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

export default app;