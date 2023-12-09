const runBuild = require("./webpackBuild");
const bundleCommand = {
  name: "build",
  func: runBuild,
  description: "build app",
  options: [],
};
exports.command = bundleCommand;
