const path = require("path");
const commander = require("commander");
const commands = require("./commands");
const { name: appName, version: appVersion } = require("../package.json");
const pathConfigs = require("../config/paths");
const envVariate = require("../config/env");

process.env.APP_VERSION = appVersion;
process.env.APP_NAME = appName;

const { contextDir } = pathConfigs;
const configDir = path.join(contextDir, "./config");
const envConfig = {
  appVersion: appVersion,
  appName: appName,
  contextDir: contextDir,
  configDir: configDir,
  pathConfigs: pathConfigs,
  production: {
    needVariable: envVariate.production, // need environment variable
    envFile: path.join(contextDir, ".env.prod"), // environment file
    webpackConfigFile: path.join(configDir, "webpack.prod.js"), // webpack config file
  },
  development: {
    needVariable: envVariate.development, // need environment variable
    envFile: path.join(contextDir, ".env.dev"), // environment file
    webpackConfigFile: path.join(configDir, "webpack.dev.js"), // webpack config file
  },
};

const program = new commander.Command()
  .usage("[command] [options]")
  .version("0.1.0")
  .option("--verbose", "Increase logging verbosity");

const handleError = (err) => {
  if (program.opts().verbose) {
    console.error(err.message);
  } else {
    const message = err.message.replace(/\.$/, "");
    console.error(`${message}.`);
  }
  if (err.stack) {
    console.log(err.stack);
  }
  process.exit(1);
};

function printExamples(examples) {
  let output = [];
  if (examples && examples.length > 0) {
    const formattedUsage = examples
      .map((example) => `  ${example.desc}: \n  ${example.cmd}`)
      .join("\n\n");
    output = output.concat(["\nExample usage:", formattedUsage]);
  }
  return output.join("\n").concat("\n");
}

function attachCommand(command) {
  // 定义命令
  const cmd = program
    .command(command.name)
    .action(async function handleAction() {
      const passedOptions = this.opts();
      try {
        await command.func(passedOptions, envConfig);
      } catch (error) {
        handleError(error);
      }
    });

  if (command.description) {
    cmd.description(command.description);
  }

  cmd.addHelpText("after", printExamples(command.examples));

  // 定义命令的选项
  for (const opt of command.options || []) {
    cmd.option(
      opt.name, // 参数名
      opt.description ?? "", // 参数描述
      opt.parse || ((val) => val), // 转换方法
      typeof opt.default === "function" ? opt.default(config) : opt.default // 默认值
    );
  }
}

async function setupAndRun() {
  for (const command of [...commands.projectCommands]) {
    attachCommand(command);
  }
  program.parse(process.argv);
}

async function run() {
  try {
    await setupAndRun();
  } catch (e) {
    handleError(e);
  }
}

exports.run = run;
