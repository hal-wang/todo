import { V } from "@halsp/validator";

export class GetTodoCountDto {
  @V().Required().Description("The count of todos")
  total!: number;
}
