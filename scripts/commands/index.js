const { command: startCommand } = require("./start/index");
const { command: bundleCommand } = require("./bundle/index");

exports.projectCommands = [startCommand, bundleCommand];
