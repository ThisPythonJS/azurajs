import { AzuraClient } from "../../package/src/infra/Server";

const app = new AzuraClient();

// Middleware simples
app.use((req, res, next) => {
  console.log("Middleware 1 executado");
  if (next) next();
});

app.use(async (req, res, next) => {
  console.log("Middleware 2 (async) executado");
  if (next) next();
});

// Rota simples
app.get("/test", (req, res) => {
  console.log("Handler /test executado");
  res.json({ message: "Funcionou com middlewares!" });
});

console.log("Servidor com middlewares iniciando...");
app.listen(3000);
