import { V } from "@ipare/validator";

@V().Description("user info")
export class UserInfoDto {
  @V().Description("Automatically generated ID")
  _id!: string;

  @V().Description("Plaintext password")
  password!: string;

  @V().IsInt().Format("timestamp").Description("When the user created")
  create_at!: number;
}
