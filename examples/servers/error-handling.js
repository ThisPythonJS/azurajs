// ============================================
// Exemplo 6: Error Handling e HttpError
// ============================================

import { AzuraClient } from '../package/dist/index.js';
import { HttpError } from '../package/dist/http-error.js';

async function main() {
  const app = new AzuraClient();

  // Middleware de tratamento de erros global
  app.use((ctx) => {
    try {
      ctx.next();
    } catch (error) {
      console.error('Error caught:', error);

      // Se for um HttpError, usa status e mensagem
      if (error instanceof HttpError) {
        ctx.res.status(error.status).json({
          error: error.message,
          status: error.status
        });
      } else {
        // Erro genérico
        ctx.res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
        });
      }
    }
  });

  // Rota que retorna sucesso
  app.get('/', (ctx) => {
    ctx.res.json({
      message: 'Error handling example',
      endpoints: {
        'GET /success': 'Returns 200',
        'GET /not-found': 'Returns 404',
        'GET /unauthorized': 'Returns 401',
        'GET /bad-request': 'Returns 400',
        'GET /server-error': 'Returns 500',
        'GET /custom-error/:code': 'Returns custom error code'
      }
    });
  });

  // Rota de sucesso
  app.get('/success', (ctx) => {
    ctx.res.json({
      status: 'success',
      message: 'Everything is working fine!'
    });
  });

  // 404 - Not Found
  app.get('/not-found', (ctx) => {
    throw new HttpError(404, 'Resource not found');
  });

  // 401 - Unauthorized
  app.get('/unauthorized', (ctx) => {
    throw new HttpError(401, 'Authentication required');
  });

  // 400 - Bad Request
  app.get('/bad-request', (ctx) => {
    throw new HttpError(400, 'Invalid request parameters');
  });

  // 403 - Forbidden
  app.get('/forbidden', (ctx) => {
    throw new HttpError(403, 'Access denied');
  });

  // 500 - Server Error
  app.get('/server-error', (ctx) => {
    throw new Error('Unexpected server error');
  });

  // Error customizado com código
  app.get('/custom-error/:code', (ctx) => {
    const code = parseInt(ctx.req.params.code);
    
    if (code < 100 || code > 599) {
      throw new HttpError(400, 'Invalid HTTP status code');
    }

    throw new HttpError(code, `Custom error with code ${code}`);
  });

  // Rota de validação com múltiplos erros
  app.post('/validate', async (ctx) => {
    const body = await ctx.req.json();
    const errors = [];

    if (!body.name) {
      errors.push('Name is required');
    }

    if (!body.email) {
      errors.push('Email is required');
    } else if (!body.email.includes('@')) {
      errors.push('Email must be valid');
    }

    if (!body.age) {
      errors.push('Age is required');
    } else if (body.age < 18) {
      errors.push('Age must be at least 18');
    }

    if (errors.length > 0) {
      ctx.res.status(400).json({
        error: 'Validation failed',
        errors
      });
      return;
    }

    ctx.res.json({
      message: 'Validation passed',
      data: body
    });
  });

  // Rota assíncrona com try-catch
  app.get('/async-error', async (ctx) => {
    try {
      // Simula operação assíncrona que falha
      await Promise.reject(new Error('Async operation failed'));
    } catch (error) {
      throw new HttpError(500, `Async error: ${error.message}`);
    }
  });

  // Rota que sempre retorna 503 (Service Unavailable)
  app.get('/maintenance', (ctx) => {
    throw new HttpError(503, 'Service temporarily unavailable for maintenance');
  });

  await app.listen();
  console.log('✅ Error handling server running on http://localhost:3000');
  console.log('');
  console.log('📝 Test different errors:');
  console.log('');
  console.log('Success (200):');
  console.log('  curl http://localhost:3000/success');
  console.log('');
  console.log('Not Found (404):');
  console.log('  curl http://localhost:3000/not-found');
  console.log('');
  console.log('Unauthorized (401):');
  console.log('  curl http://localhost:3000/unauthorized');
  console.log('');
  console.log('Bad Request (400):');
  console.log('  curl http://localhost:3000/bad-request');
  console.log('');
  console.log('Server Error (500):');
  console.log('  curl http://localhost:3000/server-error');
  console.log('');
  console.log('Custom Error:');
  console.log('  curl http://localhost:3000/custom-error/418');
  console.log('');
  console.log('Validation (should fail):');
  console.log('  curl -X POST -H "Content-Type: application/json" -d \'{"name":"John"}\' http://localhost:3000/validate');
}

main().catch(console.error);
