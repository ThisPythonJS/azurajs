import { AzuraClient } from "../../package/src/infra/Server";

const app = new AzuraClient();

// Rota simples sem middlewares
app.get("/test", (req, res) => {
  console.log("Handler executado!");
  console.log("req existe?", !!req);
  console.log("res existe?", !!res);
  res.json({ message: "Funcionou!" });
});

// Rota com 3 parâmetros
app.get("/test2", (req, res, next) => {
  console.log(req, res);
  console.log("Handler com next executado!");
  res.json({ message: "Funcionou com next!" });
});

console.log("Servidor iniciando...");
app.listen(3000);
