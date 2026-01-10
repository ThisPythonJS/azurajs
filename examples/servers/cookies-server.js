// ============================================
// Exemplo 5: Servidor com Cookies
// ============================================

import { AzuraClient } from '../package/dist/index.js';

async function main() {
  const app = new AzuraClient();

  // Rota inicial
  app.get('/', (ctx) => {
    ctx.res.json({
      message: 'Cookie example server',
      endpoints: {
        'GET /set-cookie': 'Set a cookie',
        'GET /get-cookie': 'Read cookies',
        'GET /delete-cookie': 'Delete a cookie',
        'GET /login': 'Simulate login with session cookie',
        'GET /profile': 'Check if logged in'
      }
    });
  });

  // Definir cookie simples
  app.get('/set-cookie', (ctx) => {
    ctx.res.setCookie('username', 'john_doe', {
      maxAge: 3600, // 1 hora em segundos
      httpOnly: true,
      path: '/'
    });

    ctx.res.json({
      message: 'Cookie set successfully',
      cookie: {
        name: 'username',
        value: 'john_doe',
        expires: '1 hour'
      }
    });
  });

  // Ler cookies
  app.get('/get-cookie', (ctx) => {
    const username = ctx.req.cookies.username;

    if (!username) {
      ctx.res.json({
        message: 'No username cookie found',
        allCookies: ctx.req.cookies
      });
      return;
    }

    ctx.res.json({
      message: 'Cookie found',
      username,
      allCookies: ctx.req.cookies
    });
  });

  // Deletar cookie
  app.get('/delete-cookie', (ctx) => {
    ctx.res.setCookie('username', '', {
      maxAge: -1, // Expira imediatamente
      path: '/'
    });

    ctx.res.json({
      message: 'Cookie deleted'
    });
  });

  // Simular login com cookie de sessão
  app.post('/login', async (ctx) => {
    const body = await ctx.req.json();

    if (body.username === 'admin' && body.password === 'password') {
      // Cria um token de sessão simples
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      ctx.res.setCookie('session_token', sessionToken, {
        maxAge: 86400, // 24 horas
        httpOnly: true,
        secure: false, // Em produção, use true com HTTPS
        path: '/'
      });

      ctx.res.json({
        message: 'Login successful',
        user: { username: body.username }
      });
    } else {
      ctx.res.status(401).json({
        error: 'Invalid credentials',
        hint: 'Use username: admin, password: password'
      });
    }
  });

  // Rota protegida que verifica cookie de sessão
  app.get('/profile', (ctx) => {
    const sessionToken = ctx.req.cookies.session_token;

    if (!sessionToken) {
      ctx.res.status(401).json({
        error: 'Not authenticated',
        message: 'Please login first at POST /login'
      });
      return;
    }

    ctx.res.json({
      message: 'Profile data',
      user: {
        username: 'admin',
        sessionToken,
        loggedIn: true
      }
    });
  });

  // Logout
  app.post('/logout', (ctx) => {
    ctx.res.setCookie('session_token', '', {
      maxAge: -1,
      path: '/'
    });

    ctx.res.json({
      message: 'Logged out successfully'
    });
  });

  // Múltiplos cookies
  app.get('/set-multiple-cookies', (ctx) => {
    ctx.res.setCookie('user_id', '12345', { maxAge: 3600, path: '/' });
    ctx.res.setCookie('user_role', 'admin', { maxAge: 3600, path: '/' });
    ctx.res.setCookie('theme', 'dark', { maxAge: 7200, path: '/' });

    ctx.res.json({
      message: 'Multiple cookies set',
      cookies: ['user_id', 'user_role', 'theme']
    });
  });

  await app.listen();
  console.log('✅ Cookie server running on http://localhost:3000');
  console.log('');
  console.log('📝 Test commands:');
  console.log('');
  console.log('Set cookie:');
  console.log('  curl -c cookies.txt http://localhost:3000/set-cookie');
  console.log('');
  console.log('Get cookie:');
  console.log('  curl -b cookies.txt http://localhost:3000/get-cookie');
  console.log('');
  console.log('Login:');
  console.log('  curl -c cookies.txt -X POST -H "Content-Type: application/json" -d \'{"username":"admin","password":"password"}\' http://localhost:3000/login');
  console.log('');
  console.log('Access profile (after login):');
  console.log('  curl -b cookies.txt http://localhost:3000/profile');
  console.log('');
  console.log('Logout:');
  console.log('  curl -b cookies.txt -X POST http://localhost:3000/logout');
}

main().catch(console.error);
