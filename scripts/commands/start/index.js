const runServer = require("./webpackServer");
const startCommand = {
  name: "start",
  func: runServer,
  description: "Start the React development server.",
  options: [],
};
exports.command = startCommand;
