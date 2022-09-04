import { Action } from "@ipare/router";
import request = require("request");
import { Open } from "../decorators/open";
import { V } from "@ipare/validator";
import { GetBingImageDto } from "../dtos/get-bing-img.dto";

@V()
  .Tags("bing")
  .Description(`Get the bing image's url today`)
  .Response(200, GetBingImageDto)
  .ResponseDescription(200, "Bing image info")
  .ResponseDescription(404, "not found")
@Open
export default class extends Action {
  async invoke(): Promise<void> {
    return new Promise<void>((resolve) => {
      request.get(
        `http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN`,
        (error, response, body) => {
          if (error) {
            this.internalServerErrorMsg({
              message: error.message || error || "error",
            });
            resolve();
            return;
          }

          const img = JSON.parse(body).images[0];
          if (!img) {
            this.notFoundMsg();
            resolve();
            return;
          }

          this.ok(img);
          resolve();
        }
      );
    });
  }
}
