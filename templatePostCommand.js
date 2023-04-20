const fs = require("fs");

fs.renameSync("./.env.temp", "./.env.local");
fs.renameSync("./todo-api/.env.temp", "./todo-api/.env.local");

fs.unlinkSync("./templatePostCommand.js");
