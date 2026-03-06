import "dotenv/config";
import { cleanEnv, str, num, bool, email, url } from "envalid";

export const niceEnv = cleanEnv(process.env, {
  PORT: num(),
  DATABASE_HOST: str(),
  DATABASE_NAME: str(),
  DATABASE_PORT: num(),
  DATABASE_USER: str(),
  DATABASE_PASS: str(),
});
