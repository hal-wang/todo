import { Startup } from "@hal-wang/cloudbase-access";

export default {
  get isTest(): boolean {
    if (Startup.current && Startup.current.httpContext.request.context) {
      return (
        Startup.current.httpContext.request.context.function_name == "test"
      );
    } else {
      return false;
    }
  },

  adminId: "support@hal.wang",
  testId: "test@hal.wang",
};
