import { Action } from "@ipare/router";
import request = require("request");
import { Open } from "../decorators/open";

/**
 * @action get bing img
 *
 * get the bing image's url today
 *
 * @output
 * @@codes
 * @@@204 success
 * @@@404 not found
 * @@body {object} bing img's info
 */

/**
 * @openapi
 * /bing:
 *   get:
 *     tags:
 *       - bing
 *     description: Get the bing image's url today
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Bing img's info
 *       404:
 *         description: not found
 */
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
