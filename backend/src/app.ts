import { Hono } from 'hono';

const app = new Hono();

//ruta health
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.get('*', (c) => {
  return c.json({ error: 'Not Found' }, 404);
})

export default app;

//Porque app.ts
// representa la aplicación y no depende de que exista un puerto abierto.
// Esto nos permitirá probar rutas directamente mediante la API de pruebas de Hono.