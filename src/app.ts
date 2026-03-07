import express, {
  json,
  type Response,
  type Request,
  type NextFunction,
} from "express";
import { RegisterRoutes } from "../build/routes";
import * as swaggerDocument from "../build/swagger.json";
import { apiReference } from "@scalar/express-api-reference";
import { HttpError } from "./core/persistence/utils/errors";
export const app = express();

app.use(json());
app.use(
  "/docs",
  apiReference({
    content: swaggerDocument,
    title: "Jitterbit - Teste técnico",
    pageTitle: "Documentação",
    theme: "purple",
  }),
);

app.use((req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function (body: any): Response {
    if (res.locals.skipResponseTransform) {
      return originalJson.call(this, body);
    }
    const transformedBody = {
      statusCode: res.statusCode,
      data: body,
    };
    return originalJson.call(this, transformedBody);
  };

  next();
});

RegisterRoutes(app);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.skipResponseTransform = true;

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      data: null,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    data: null,
  });
});
