import { DtoDescription, DtoFormat, DtoType } from "@ipare/swagger";

@DtoDescription("user info")
export class UserInfoDto {
  @DtoDescription("Automatically generated ID")
  _id!: string;

  @DtoDescription("Plaintext password")
  password!: string;

  @DtoType("integer")
  @DtoFormat("timestamp")
  @DtoDescription("When the user created")
  create_at!: number;
}
