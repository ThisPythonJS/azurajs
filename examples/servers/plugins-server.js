// ============================================
// Exemplo 4: Servidor com Plugins (CORS + Rate Limit)
// ============================================

import { AzuraClient } from '../package/dist/index.js';
import { cors } from '../package/dist/cors.js';
import { rateLimit } from '../package/dist/rate-limit.js';

async function main() {
  const app = new AzuraClient();

  // Plugin CORS - permite requisições de outras origens
  const corsPlugin = cors({
    origin: '*', // Em produção, use domínios específicos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });

  app.use(corsPlugin);

  // Plugin Rate Limit - limita número de requisições
  const rateLimiter = rateLimit({
    windowMs: 60000, // 1 minuto
    max: 10, // máximo 10 requisições por minuto
    message: {
      error: 'Too many requests',
      message: 'Please try again in 1 minute'
    }
  });

  app.use(rateLimiter);

  // Rotas de teste
  app.get('/', (ctx) => {
    ctx.res.json({
      message: 'Server with CORS and Rate Limit',
      info: {
        cors: 'Allows cross-origin requests',
        rateLimit: 'Max 10 requests per minute per IP'
      }
    });
  });

  app.get('/api/data', (ctx) => {
    ctx.res.json({
      data: [1, 2, 3, 4, 5],
      timestamp: new Date().toISOString()
    });
  });

  app.post('/api/submit', async (ctx) => {
    const body = await ctx.req.json();
    ctx.res.json({
      message: 'Data received',
      received: body
    });
  });

  // Rota sem rate limit (para teste)
  app.get('/health', (ctx) => {
    ctx.res.json({ status: 'ok' });
  });

  await app.listen();
  console.log('✅ Server with plugins running on http://localhost:3000');
  console.log('');
  console.log('🔒 Features enabled:');
  console.log('  - CORS: Allows cross-origin requests');
  console.log('  - Rate Limit: Max 10 requests/minute per IP');
  console.log('');
  console.log('📝 Test rate limit:');
  console.log('  for i in {1..15}; do curl http://localhost:3000/api/data && echo ""; done');
  console.log('');
  console.log('  (After 10 requests, you\'ll get a 429 error)');
}

main().catch(console.error);
