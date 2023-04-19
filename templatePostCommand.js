const fs = require("fs");

const envStr = `ENV_ID=<your_env_id>
JWT_SECRET=<your_jwt_secret>`;

fs.writeFileSync("./.env.local", envStr);

fs.unlinkSync("./templatePostCommand.js");
