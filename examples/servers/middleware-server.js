// ============================================
// Exemplo 2: Servidor com Middleware
// ============================================

import { AzuraClient, createLoggingMiddleware } from '../package/dist/index.js';

async function main() {
  const app = new AzuraClient();

  // Middleware de logging
  const logger = createLoggingMiddleware(app.getConfig());
  app.use(logger);

  // Middleware customizado - Autenticação fake
  const authMiddleware = (ctx) => {
    const token = ctx.req.headers['authorization'];
    
    if (!token) {
      ctx.res.status(401).json({
        error: 'No token provided',
        message: 'Add header: Authorization: Bearer your-token'
      });
      return;
    }

    // Simula validação de token
    ctx.req.user = {
      id: '123',
      name: 'John Doe',
      token: token
    };

    ctx.next();
  };

  // Middleware customizado - Timer
  const timerMiddleware = (ctx) => {
    const start = Date.now();
    
    ctx.next();
    
    const duration = Date.now() - start;
    console.log(`⏱️  Request took ${duration}ms`);
  };

  app.use(timerMiddleware);

  // Rota pública (sem auth)
  app.get('/', (ctx) => {
    ctx.res.json({
      message: 'Public route - no auth required',
      endpoints: {
        public: 'GET /',
        protected: 'GET /profile (needs Authorization header)'
      }
    });
  });

  // Rota protegida
  app.get('/profile', authMiddleware, (ctx) => {
    ctx.res.json({
      message: 'Protected route',
      user: ctx.req.user
    });
  });

  // Rota protegida com dados
  app.post('/data', authMiddleware, async (ctx) => {
    const body = await ctx.req.json();
    
    ctx.res.json({
      message: 'Data received',
      user: ctx.req.user,
      data: body
    });
  });

  await app.listen();
  console.log('✅ Server with middleware running on http://localhost:3000');
  console.log('');
  console.log('📝 Test commands:');
  console.log('');
  console.log('Public route:');
  console.log('  curl http://localhost:3000/');
  console.log('');
  console.log('Protected route (will fail):');
  console.log('  curl http://localhost:3000/profile');
  console.log('');
  console.log('Protected route (with auth):');
  console.log('  curl -H "Authorization: Bearer my-token" http://localhost:3000/profile');
  console.log('');
  console.log('POST with auth:');
  console.log('  curl -X POST -H "Authorization: Bearer my-token" -H "Content-Type: application/json" -d \'{"name":"test"}\' http://localhost:3000/data');
}

main().catch(console.error);
