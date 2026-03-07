import { Body, Controller, Post, Route, Tags } from "tsoa";
import { AuthDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Route("auth")
@Tags("Autenticação")
export class AuthController {
  private authService = new AuthService();

  /**
   *
   * @summary Login
   */
  @Post("login")
  async login(@Body() body: AuthDto.Login) {
    return await this.authService.login(body);
  }

  /**
   *
   * @summary Cadastrar usuário
   */
  @Post("register")
  async register(@Body() body: AuthDto.Login) {
    return await this.authService.register(body);
  }
}
