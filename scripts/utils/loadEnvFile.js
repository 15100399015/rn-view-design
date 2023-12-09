const dotenv = require("dotenv");
const { checkFileExist, exitProcess, Logger, verifyEnv } = require("./utils");

/**
 * log env file
 * @param {*} envMode
 * @returns
 */
function loadEnvFile(envMode, envConfig) {
  const envFile = envConfig[envMode].envFile;
  const needVariable = envConfig[envMode].needVariable;
  // load
  dotenv.config({ path: envFile, processEnv: process.env });
  if (!checkFileExist([envFile]).status) {
    Logger.logWarn(envFile + " does not exist,  will Use default value");
  }
  function fillDefaultValue(envObject) {
    for (let i = 0; i < needVariable.length; i++) {
      const variable = needVariable[i];
      if (envObject[variable.name] === void 0) {
        envObject[variable.name] = variable.default;
      }
    }
  }
  fillDefaultValue(process.env);
  const missVariable = verifyEnv(
    needVariable.map((v) => v.name),
    process.env
  );
  if (missVariable.length) {
    exitProcess(`please check it ${envFile}, ${missVariable.join(",")} miss`);
  }
}

module.exports = loadEnvFile;
