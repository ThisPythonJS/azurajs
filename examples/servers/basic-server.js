// ============================================
// Exemplo 1: Servidor básico em JavaScript
// ============================================

import { AzuraClient } from '../package/dist/index.js';

async function main() {
  const app = new AzuraClient();

  // Rota GET simples
  app.get('/', (ctx) => {
    ctx.res.json({
      message: 'Hello from JavaScript!',
      timestamp: new Date().toISOString()
    });
  });

  // Rota GET com parâmetros
  app.get('/users/:id', (ctx) => {
    const userId = ctx.req.params.id;
    ctx.res.json({
      id: userId,
      name: `User ${userId}`,
      type: 'example'
    });
  });

  // Rota POST com body
  app.post('/users', async (ctx) => {
    const body = await ctx.req.json();
    ctx.res.json({
      message: 'User created',
      data: body,
      id: Math.random().toString(36).substr(2, 9)
    });
  });

  // Rota com query params
  app.get('/search', (ctx) => {
    const query = ctx.req.query.q || 'empty';
    const page = ctx.req.query.page || '1';
    
    ctx.res.json({
      query,
      page: parseInt(page),
      results: [
        { id: 1, title: `Result for ${query}` },
        { id: 2, title: `Another result for ${query}` }
      ]
    });
  });

  // Rota com status customizado
  app.get('/status', (ctx) => {
    ctx.res.status(201).json({
      status: 'created',
      code: 201
    });
  });

  await app.listen();
  console.log('✅ Server running on http://localhost:3000');
  console.log('📝 Try these routes:');
  console.log('   GET  http://localhost:3000/');
  console.log('   GET  http://localhost:3000/users/123');
  console.log('   POST http://localhost:3000/users');
  console.log('   GET  http://localhost:3000/search?q=test&page=2');
  console.log('   GET  http://localhost:3000/status');
}

main().catch(console.error);
