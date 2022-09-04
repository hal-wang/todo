import { V } from "@ipare/validator";

export class GetTodoCountDto {
  @V().Required().Description("The count of todos")
  total!: number;
}
