# AzuraJS Examples

This directory contains example applications demonstrating various features of AzuraJS.

## Getting Started

```bash
bun install
bun run start
```

The server will start at `http://localhost:3000`

## Available Routes

### Home Page

- **GET /** - Interactive documentation with all available routes

### Health Check

- **GET /ping** - Simple health check endpoint

### User API

- **GET /api/users** - List all users
- **GET /api/users/:id** - Get user by ID
- **POST /api/users** - Create new user
- **PUT /api/users/:id** - Update user
- **DELETE /api/users/:id** - Delete user

### Search

- **GET /search?q=query&page=1** - Search with query parameters
- **GET /search/advanced** - Advanced search with filters

## Testing Routes

### Using cURL

```bash
curl http://localhost:3000/ping

curl http://localhost:3000/api/users

curl http://localhost:3000/api/users/1

curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'

curl -X DELETE http://localhost:3000/api/users/1

curl "http://localhost:3000/search?q=azurajs&page=1"
```

### Using Browser

Simply navigate to `http://localhost:3000` to see the interactive documentation.

## Configuration

The example uses `azura.config.ts` for configuration:

- **Environment**: Development mode by default
- **Port**: 3000
- **Logging**: Enabled with detailed output
- **CORS**: Enabled for all origins

## Logging

The example includes request/response logging that shows:

- HTTP method and URL
- Client IP address
- Query parameters
- Route parameters
- Request body
- Response status code
- Response time in milliseconds

Example output:

```
🔵 [2026-01-07T00:30:45.123Z] GET /api/users | IP: ::1
✅ 200 - 5ms
```

## Switching to Production Mode

```bash
NODE_ENV=production bun run start
```

In production mode:

- Logging is more concise
- Details are hidden for security
- Performance is optimized

## Project Structure

```
test/
├── index.ts                    # Main application entry point
├── azura.config.ts             # Configuration file
├── controllers/                # Controllers directory
│   ├── index.ts               # Export all controllers
│   ├── HomeController.ts      # Home and health check routes
│   ├── UserController.ts      # User CRUD operations
│   └── SearchController.ts    # Search functionality
├── types/                      # TypeScript types and interfaces
│   └── index.ts               # Shared type definitions
├── package.json               # Dependencies
└── EXAMPLE.md                 # This file
```

## Features Demonstrated

✅ Decorator-based routing  
✅ Controller organization  
✅ Parameter injection (@Body, @Query, @Param, @Res)  
✅ Middleware usage  
✅ Request logging  
✅ Configuration management  
✅ Environment-based settings  
✅ JSON responses  
✅ HTML responses  
✅ Status codes  
✅ Query parameters  
✅ Route parameters  
✅ Request body parsing  
✅ CRUD operations  
✅ Error handling

## Learn More

- [AzuraJS Documentation](../package/README.md)
- [API Reference](../package/README.md#api-reference)
- [Configuration Guide](../package/README.md#configuration)
