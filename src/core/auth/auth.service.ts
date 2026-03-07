import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AuthDto } from "./auth.dto";
import { AuthRepository } from "./auth.repository";
import { BadRequestError } from "../persistence/utils/errors";
import { niceEnv } from "../persistence/utils/env";
export class AuthService {
  private async hashPassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }

  async login(body: AuthDto.Login) {
    const authRepository = new AuthRepository();

    const user = await authRepository.findUserByEmail(body.email);
    if (!user) {
      throw new BadRequestError("Usuário com esse email não existe");
    }

    const equalPassword = await bcrypt.compare(body.password, user.password);

    if (!equalPassword) {
      throw new BadRequestError("Senha incorreta");
    }

    const token = jwt.sign({ id: user.id }, niceEnv.JWT_SECRET);

    return {
      token,
    };
  }

  async register(body: AuthDto.Login) {
    const authRepository = new AuthRepository();

    const existingUser = await authRepository.findUserByEmail(body.email);
    if (existingUser) {
      throw new BadRequestError("Usuário com esse email já existe no sistema");
    }

    const hashedPassword = await this.hashPassword(body.password);

    const userId = await authRepository.createUser({
      email: body.email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: userId }, niceEnv.JWT_SECRET);

    return {
      token,
    };
  }

  async findUser(id: string) {
    const authRepository = new AuthRepository();
    const user = await authRepository.findUser(id);
    return user;
  }
}
