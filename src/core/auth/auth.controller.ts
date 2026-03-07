import { Body, Controller, Post, Route } from "tsoa";
import { AuthDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Route("auth")
export class AuthController {
  private authService = new AuthService();
  @Post("login")
  async login(@Body() body: AuthDto.Login) {
    return await this.authService.login(body);
  }

  @Post("register")
  async register(@Body() body: AuthDto.Login) {
    return await this.authService.register(body);
  }
}
