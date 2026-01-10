/**
 * AzuraJS - Simple JavaScript Server
 * 
 * This example demonstrates how to use AzuraJS with plain JavaScript
 * without TypeScript decorators.
 */

import { AzuraClient } from "azurajs";
import { createLoggingMiddleware } from "azurajs/middleware";

// Create app instance
const app = new AzuraClient();

// Add logging middleware
const logger = createLoggingMiddleware(app.getConfig());
app.use(logger);

// Home route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to AzuraJS with JavaScript!",
    version: "2.2.0",
    language: "JavaScript"
  });
});

// About route
app.get("/about", (req, res) => {
  res.json({
    framework: "AzuraJS",
    description: "Modern web framework with TypeScript and JavaScript support",
    features: [
      "Zero dependencies",
      "High performance",
      "TypeScript and JavaScript support",
      "Express-like API",
      "Built-in middleware"
    ]
  });
});

// Echo route with query parameters
app.get("/echo", (req, res) => {
  const { message = "Hello World" } = req.query;
  res.json({ echo: message });
});

// User route with path parameters
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    id: Number(id),
    name: `User ${id}`,
    email: `user${id}@example.com`
  });
});

// POST route with body
app.post("/data", (req, res) => {
  const body = req.body;
  res.status(201).json({
    received: body,
    timestamp: new Date().toISOString()
  });
});

// Start server
const port = process.env.PORT || 3000;
await app.listen(port);
console.log(`🚀 Server running on http://localhost:${port}`);
console.log(`📝 Language: JavaScript`);
console.log(`📦 Framework: AzuraJS v2.2.0`);
