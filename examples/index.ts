import { AzuraClient, createLoggingMiddleware } from "../package/src/infra/Server";
import { applyDecorators } from "../package/src/decorators/Route";
import { HomeController, UserController, SearchController } from "./controllers";

async function bootstrap() {
  const app = new AzuraClient();

  const loggingMiddleware = createLoggingMiddleware(app.getConfig());
  app.use(loggingMiddleware);

  applyDecorators(app, [HomeController, UserController, SearchController]);

  await app.listen();
}

bootstrap().catch(console.error);
