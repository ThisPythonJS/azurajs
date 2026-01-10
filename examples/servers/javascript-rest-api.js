/**
 * AzuraJS - Complete REST API in JavaScript
 * 
 * Full CRUD operations for managing users
 */

import { AzuraClient } from "azurajs";
import { createLoggingMiddleware } from "azurajs/middleware";

const app = new AzuraClient();
const logger = createLoggingMiddleware(app.getConfig());
app.use(logger);

// In-memory data store
const users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", age: 28 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", age: 34 },
  { id: 3, name: "Carol White", email: "carol@example.com", age: 25 }
];

let nextId = 4;

// Custom middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes

// GET /api/users - List all users
app.get("/api/users", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit);
  
  const paginatedUsers = users.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedUsers,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: users.length,
      totalPages: Math.ceil(users.length / limit)
    }
  });
});

// GET /api/users/:id - Get user by ID
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === Number(id));
  
  if (!user) {
    return res.status(404).json({ 
      error: "User not found",
      code: "USER_NOT_FOUND"
    });
  }
  
  res.json({ data: user });
});

// POST /api/users - Create new user
app.post("/api/users", (req, res) => {
  const { name, email, age } = req.body;
  
  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required",
      code: "VALIDATION_ERROR"
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      error: "Email already exists",
      code: "EMAIL_CONFLICT"
    });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email,
    age: age ? Number(age) : null,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    message: "User created successfully",
    data: newUser
  });
});

// PUT /api/users/:id - Update user
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  
  const index = users.findIndex(u => u.id === Number(id));
  
  if (index === -1) {
    return res.status(404).json({
      error: "User not found",
      code: "USER_NOT_FOUND"
    });
  }
  
  // Check if new email conflicts with another user
  if (email && email !== users[index].email) {
    const emailExists = users.find(u => u.email === email && u.id !== Number(id));
    if (emailExists) {
      return res.status(409).json({
        error: "Email already exists",
        code: "EMAIL_CONFLICT"
      });
    }
  }
  
  // Update user
  users[index] = {
    ...users[index],
    name: name || users[index].name,
    email: email || users[index].email,
    age: age !== undefined ? Number(age) : users[index].age,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    message: "User updated successfully",
    data: users[index]
  });
});

// PATCH /api/users/:id - Partial update
app.patch("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const index = users.findIndex(u => u.id === Number(id));
  
  if (index === -1) {
    return res.status(404).json({
      error: "User not found",
      code: "USER_NOT_FOUND"
    });
  }
  
  users[index] = {
    ...users[index],
    ...updates,
    id: users[index].id, // Prevent ID from being changed
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    message: "User updated successfully",
    data: users[index]
  });
});

// DELETE /api/users/:id - Delete user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === Number(id));
  
  if (index === -1) {
    return res.status(404).json({
      error: "User not found",
      code: "USER_NOT_FOUND"
    });
  }
  
  const deletedUser = users[index];
  users.splice(index, 1);
  
  res.json({
    message: "User deleted successfully",
    data: deletedUser
  });
});

// Search users
app.get("/api/users/search", (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      error: "Search query is required",
      code: "MISSING_QUERY"
    });
  }
  
  const searchTerm = q.toLowerCase();
  const results = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm) ||
    u.email.toLowerCase().includes(searchTerm)
  );
  
  res.json({
    query: q,
    results: results,
    count: results.length
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users: users.length
  });
});

// 404 handler (should be last)
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    code: "NOT_FOUND",
    path: req.url
  });
});

// Start server
const port = process.env.PORT || 3000;
await app.listen(port);

console.log(`🚀 REST API Server running on http://localhost:${port}`);
console.log(`📝 Language: JavaScript`);
console.log(`\n📋 Available endpoints:`);
console.log(`  GET    /api/users          - List all users`);
console.log(`  GET    /api/users/:id      - Get user by ID`);
console.log(`  POST   /api/users          - Create new user`);
console.log(`  PUT    /api/users/:id      - Update user`);
console.log(`  PATCH  /api/users/:id      - Partial update`);
console.log(`  DELETE /api/users/:id      - Delete user`);
console.log(`  GET    /api/users/search   - Search users`);
console.log(`  GET    /health             - Health check`);
