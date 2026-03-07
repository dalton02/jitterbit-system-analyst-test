export namespace AuthDto {
  export type Login = {
    /**
     * @pattern ^(.+)@(.+)$ Insira um email correto
     * @example "email@mail.com"
     */
    email: string;
    /**
     * @minLength 6 A senha deve ter no mínimo 6 caracteres
     *  @example "@Senha123"
     */
    password: string;
  };
  export type User = {
    id: string;
    email: string;
    password: string;
  };
}
export namespace AuthExample {
  export const Login: AuthDto.Login = {
    email: "email@email.com",
    password: "123",
  };
}
