// ============================================
// Exemplo 3: CRUD completo em JavaScript
// ============================================

import { AzuraClient } from '../package/dist/index.js';

// Simulação de banco de dados em memória
const database = {
  users: [
    { id: '1', name: 'Alice', email: 'alice@example.com', age: 25 },
    { id: '2', name: 'Bob', email: 'bob@example.com', age: 30 },
    { id: '3', name: 'Charlie', email: 'charlie@example.com', age: 35 }
  ],
  nextId: 4
};

async function main() {
  const app = new AzuraClient();

  // Middleware de logging simples
  app.use((ctx) => {
    console.log(`${ctx.req.method} ${ctx.req.url}`);
    ctx.next();
  });

  // ===== CRUD ROUTES =====

  // CREATE - Criar novo usuário
  app.post('/api/users', async (ctx) => {
    const body = await ctx.req.json();
    
    // Validação simples
    if (!body.name || !body.email) {
      ctx.res.status(400).json({
        error: 'Validation error',
        message: 'Name and email are required'
      });
      return;
    }

    const newUser = {
      id: String(database.nextId++),
      name: body.name,
      email: body.email,
      age: body.age || 0
    };

    database.users.push(newUser);

    ctx.res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  });

  // READ - Listar todos os usuários
  app.get('/api/users', (ctx) => {
    const page = parseInt(ctx.req.query.page || '1');
    const limit = parseInt(ctx.req.query.limit || '10');
    const skip = (page - 1) * limit;

    const paginatedUsers = database.users.slice(skip, skip + limit);

    ctx.res.json({
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: database.users.length,
        totalPages: Math.ceil(database.users.length / limit)
      }
    });
  });

  // READ - Obter usuário específico
  app.get('/api/users/:id', (ctx) => {
    const user = database.users.find(u => u.id === ctx.req.params.id);

    if (!user) {
      ctx.res.status(404).json({
        error: 'Not found',
        message: `User with id ${ctx.req.params.id} not found`
      });
      return;
    }

    ctx.res.json({ user });
  });

  // UPDATE - Atualizar usuário
  app.put('/api/users/:id', async (ctx) => {
    const userIndex = database.users.findIndex(u => u.id === ctx.req.params.id);

    if (userIndex === -1) {
      ctx.res.status(404).json({
        error: 'Not found',
        message: `User with id ${ctx.req.params.id} not found`
      });
      return;
    }

    const body = await ctx.req.json();
    const updatedUser = {
      ...database.users[userIndex],
      ...body,
      id: ctx.req.params.id // Garante que o ID não mude
    };

    database.users[userIndex] = updatedUser;

    ctx.res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  });

  // UPDATE - Atualizar parcialmente
  app.patch('/api/users/:id', async (ctx) => {
    const userIndex = database.users.findIndex(u => u.id === ctx.req.params.id);

    if (userIndex === -1) {
      ctx.res.status(404).json({
        error: 'Not found',
        message: `User with id ${ctx.req.params.id} not found`
      });
      return;
    }

    const body = await ctx.req.json();
    database.users[userIndex] = {
      ...database.users[userIndex],
      ...body,
      id: ctx.req.params.id
    };

    ctx.res.json({
      message: 'User updated successfully',
      user: database.users[userIndex]
    });
  });

  // DELETE - Deletar usuário
  app.delete('/api/users/:id', (ctx) => {
    const userIndex = database.users.findIndex(u => u.id === ctx.req.params.id);

    if (userIndex === -1) {
      ctx.res.status(404).json({
        error: 'Not found',
        message: `User with id ${ctx.req.params.id} not found`
      });
      return;
    }

    const deletedUser = database.users.splice(userIndex, 1)[0];

    ctx.res.json({
      message: 'User deleted successfully',
      user: deletedUser
    });
  });

  // Route para estatísticas
  app.get('/api/stats', (ctx) => {
    const totalUsers = database.users.length;
    const avgAge = database.users.reduce((sum, u) => sum + u.age, 0) / totalUsers;

    ctx.res.json({
      totalUsers,
      averageAge: avgAge.toFixed(2),
      users: database.users.map(u => ({ id: u.id, name: u.name }))
    });
  });

  // Rota raiz com documentação
  app.get('/', (ctx) => {
    ctx.res.json({
      message: 'CRUD API Example',
      endpoints: {
        'POST /api/users': 'Create a new user',
        'GET /api/users': 'List all users (supports ?page=1&limit=10)',
        'GET /api/users/:id': 'Get user by ID',
        'PUT /api/users/:id': 'Update user (full)',
        'PATCH /api/users/:id': 'Update user (partial)',
        'DELETE /api/users/:id': 'Delete user',
        'GET /api/stats': 'Get statistics'
      }
    });
  });

  await app.listen();
  console.log('✅ CRUD API running on http://localhost:3000');
  console.log('');
  console.log('📝 Example commands:');
  console.log('');
  console.log('List users:');
  console.log('  curl http://localhost:3000/api/users');
  console.log('');
  console.log('Get user by ID:');
  console.log('  curl http://localhost:3000/api/users/1');
  console.log('');
  console.log('Create user:');
  console.log('  curl -X POST -H "Content-Type: application/json" -d \'{"name":"David","email":"david@example.com","age":28}\' http://localhost:3000/api/users');
  console.log('');
  console.log('Update user:');
  console.log('  curl -X PUT -H "Content-Type: application/json" -d \'{"name":"Alice Updated","email":"alice.new@example.com","age":26}\' http://localhost:3000/api/users/1');
  console.log('');
  console.log('Delete user:');
  console.log('  curl -X DELETE http://localhost:3000/api/users/2');
  console.log('');
  console.log('Get stats:');
  console.log('  curl http://localhost:3000/api/stats');
}

main().catch(console.error);
