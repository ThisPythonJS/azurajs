/**
 * AzuraJS - Middleware Examples in JavaScript
 * 
 * Demonstrates various middleware patterns
 */

import { AzuraClient } from "azurajs";

const app = new AzuraClient();

// 1. Simple logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// 2. Request timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Store original send function
  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);
  
  // Override send to log duration
  res.send = function(body) {
    const duration = Date.now() - start;
    console.log(`Request completed in ${duration}ms`);
    return originalSend(body);
  };
  
  res.json = function(body) {
    const duration = Date.now() - start;
    console.log(`Request completed in ${duration}ms`);
    return originalJson(body);
  };
  
  next();
});

// 3. Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  
  if (!token) {
    return res.status(401).json({ 
      error: "No authorization token provided",
      code: "NO_TOKEN"
    });
  }
  
  // Simple token validation (replace with real validation)
  if (token === "Bearer valid-token-123") {
    req.user = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin"
    };
    next();
  } else {
    return res.status(403).json({ 
      error: "Invalid token",
      code: "INVALID_TOKEN"
    });
  }
};

// 4. Role-based access control middleware
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "NOT_AUTHENTICATED"
      });
    }
    
    if (req.user.role !== role && req.user.role !== "admin") {
      return res.status(403).json({ 
        error: "Insufficient permissions",
        code: "FORBIDDEN",
        required: role,
        current: req.user.role
      });
    }
    
    next();
  };
};

// 5. Request body validator middleware
const validateBody = (requiredFields) => {
  return (req, res, next) => {
    const body = req.body;
    const missing = [];
    
    for (const field of requiredFields) {
      if (!body || !(field in body) || body[field] === null || body[field] === undefined) {
        missing.push(field);
      }
    }
    
    if (missing.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        missing: missing
      });
    }
    
    next();
  };
};

// 6. CORS middleware (custom implementation)
const corsMiddleware = (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "86400");
  
  if (req.method === "OPTIONS") {
    return res.status(204).send();
  }
  
  next();
};

// Apply CORS to all routes
app.use(corsMiddleware);

// Public routes
app.get("/", (req, res) => {
  res.json({ message: "Public endpoint - no auth required" });
});

app.get("/public/info", (req, res) => {
  res.json({
    app: "AzuraJS Middleware Demo",
    version: "2.2.0",
    language: "JavaScript"
  });
});

// Protected routes (require authentication)
app.get("/protected/profile", authMiddleware, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user
  });
});

// Admin-only route
app.get("/admin/users", authMiddleware, requireRole("admin"), (req, res) => {
  res.json({
    message: "Admin access granted",
    users: [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" }
    ]
  });
});

// Route with body validation
app.post(
  "/api/users",
  authMiddleware,
  validateBody(["name", "email"]),
  (req, res) => {
    res.status(201).json({
      message: "User created",
      data: req.body
    });
  }
);

// Multiple middleware example
app.put(
  "/api/posts/:id",
  authMiddleware,
  requireRole("editor"),
  validateBody(["title", "content"]),
  (req, res) => {
    res.json({
      message: "Post updated",
      id: req.params.id,
      data: req.body
    });
  }
);

// Error handling middleware (should be last)
app.use((req, res, next) => {
  res.status(404).json({
    error: "Route not found",
    code: "NOT_FOUND",
    path: req.url
  });
});

// Start server
const port = process.env.PORT || 3000;
await app.listen(port);

console.log(`🚀 Middleware Demo Server running on http://localhost:${port}`);
console.log(`📝 Language: JavaScript`);
console.log(`\n🔐 Test authentication:`);
console.log(`  curl -H "Authorization: Bearer valid-token-123" http://localhost:${port}/protected/profile`);
console.log(`\n📋 Available endpoints:`);
console.log(`  GET    /                    - Public endpoint`);
console.log(`  GET    /public/info         - Public info`);
console.log(`  GET    /protected/profile   - Protected (requires auth)`);
console.log(`  GET    /admin/users         - Admin only`);
console.log(`  POST   /api/users           - Create user (requires auth + validation)`);
console.log(`  PUT    /api/posts/:id       - Update post (requires editor role)`);
