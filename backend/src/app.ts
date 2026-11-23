import { Hono } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import franchiseRouter from './modules/franchises/franchise.routes.js';
import { AppError } from './utils/AppError.js';
import characterRouter from './modules/characters/character.route.js';
import ArcRouter from './modules/arcs/arc.route.js';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.route("/api/franchises", franchiseRouter);
app.route("/api/characters", characterRouter);
app.route("/api/arcs", ArcRouter)

// non-existent routes handler (404)
app.notFound((c) => {
  return c.json({ ok: false, error: 'Not Found' }, 404);
});

// Global Error handler
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json(
      { ok: false, error: err.message },
      err.statusCode as ContentfulStatusCode
    );
  }

  // Unknown Errors (bugs, Network fail/BD)
  console.error('Unexpected error:', err);
  return c.json({ ok: false, error: 'Internal Server Error' }, 500);
});


export default app;
