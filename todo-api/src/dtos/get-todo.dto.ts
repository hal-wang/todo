import { V } from "@ipare/validator";

export class GetTodoDto {
  @V()
  _id!: string;

  @V().Description("user id")
  uid!: string;

  @V()
  schedule!: number;

  @V().Description("todo content")
  content!: string;

  @V().Description("when the todo created")
  create_at!: number;

  @V().Description("when the todo updated")
  update_at!: number;
}
