import { V } from "@ipare/validator";

export class AuthTokenDto {
  @V().Description("jwt token")
  token!: string;
}
