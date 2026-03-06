import express, { json } from "express";
import { RegisterRoutes } from "../build/routes";
import * as swaggerDocument from "../build/swagger.json";
import { apiReference } from "@scalar/express-api-reference";
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
RegisterRoutes(app);
