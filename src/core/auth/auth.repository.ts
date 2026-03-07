import { createId } from "@paralleldrive/cuid2";
import { Repository } from "../persistence/database/repository";
import { AuthDto } from "./auth.dto";

export class AuthRepository extends Repository {
  async createUser(data: AuthDto.Login) {
    const id = createId();
    await this.query(`INSERT INTO "user"(id,email,password) VALUES($1,$2,$3)`, [
      id,
      data.email,
      data.password,
    ]);
    return id;
  }

  async findUser(id: string): Promise<AuthDto.User> {
    const result = await this.query(`SELECT * FROM "user" WHERE id = $1`, [id]);
    return result.rows[0];
  }
  async findUserByEmail(email: string): Promise<AuthDto.User> {
    const result = await this.query(`SELECT * FROM "user" WHERE email = $1`, [
      email,
    ]);
    return result.rows[0];
  }
}
