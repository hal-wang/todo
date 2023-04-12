import { V } from "@halsp/validator";

export class AuthTokenDto {
  @V().Description("jwt token")
  token!: string;
}
