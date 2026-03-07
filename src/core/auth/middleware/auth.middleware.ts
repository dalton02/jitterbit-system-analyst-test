import { type Request } from "express";
import { UnauthorizedError } from "../../persistence/utils/errors";
import * as jwt from "jsonwebtoken";
import { AuthService } from "../auth.service";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new UnauthorizedError(
      "É necessário um token jwt para acessar o recurso",
    );
  }

  const token = authorization.split(" ")[1];
  let payload: { id: string };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
  } catch (err) {
    throw new UnauthorizedError("Token invalido");
  }

  const authService = new AuthService();
  const user = await authService.findUser(payload.id);
  if (!user) {
    throw new UnauthorizedError("Usuário não existe no sistema");
  }
  return user.id;
}
