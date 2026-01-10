// ============================================
// Test Debug - Ver rotas registradas
// ============================================

import { AzuraClient } from '../package/dist/index.js';

async function main() {
  const app = new AzuraClient();

  console.log('\n🔧 Registrando rotas...\n');

  // Registrar algumas rotas
  app.get('/', (ctx) => {
    ctx.res.json({ message: 'Home' });
  });

  app.get('/users', (ctx) => {
    ctx.res.json({ users: [] });
  });

  app.get('/users/:id', (ctx) => {
    ctx.res.json({ user: { id: ctx.req.params.id } });
  });

  app.post('/users', async (ctx) => {
    const body = await ctx.req.json();
    ctx.res.json({ created: body });
  });

  app.get('/api/v1/products', (ctx) => {
    ctx.res.json({ products: [] });
  });

  // Listar rotas antes de iniciar
  const routes = app.getRoutes();
  console.log('📋 Rotas registradas antes do listen:');
  routes.forEach(r => {
    console.log(`   ${r.method.padEnd(7)} ${r.path}`);
  });

  console.log('\n🚀 Iniciando servidor...\n');

  await app.listen();
}

main().catch(console.error);
