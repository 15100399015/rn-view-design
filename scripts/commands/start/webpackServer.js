const url = require("url");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const { clearConsole, Logger, preCheck } = require("../../utils/utils");
const loadEnvFile = require("../../utils/loadEnvFile");

async function webpackServe(options, config) {
  loadEnvFile("development", config);
  preCheck(config.pathConfigs);
  const webpackConfig = require(config["development"].webpackConfigFile);
  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(webpackConfig.devServer, compiler);
  devServer.startCallback(() => {
    Logger.logInfo("Start server");
  });
  compiler.hooks.done.tap("done", async (stats) => {
    clearConsole();
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });
    // 协议
    const protocol = devServer.options.server.type;
    // 映射的静态目录
    const staticDir = devServer.options.static
      .map((item) => item.directory)
      .join();
    // port
    const { port } = devServer.server.address();
    const prettyPrintURL = (newHostname) =>
      url.format({ protocol, hostname: newHostname, port, pathname: "/" });

    const isSuccessful = !statsData.errors.length && !statsData.warnings.length;
    if (isSuccessful) {
      Logger.logSuccess(`Compile Success`);
      Logger.log();
      Logger.log(
        `You can now view ${Logger.blue(
          config.appName + "@" + config.appVersion
        )} in the browser.`
      );
      Logger.log();

      Logger.log(
        "LOCAL:               " +
          Logger.blue(`${prettyPrintURL("localhost")}`, true)
      );
      Logger.log(
        "LAN:                 " +
          Logger.blue(
            `${prettyPrintURL(WebpackDevServer.internalIPSync("v4"))}`,
            true
          )
      );
      Logger.log("LOCAL STATIC DIR:    " + Logger.blue(`${staticDir}`, true));
      Logger.log();

      Logger.logInfo(`Proxy Table:`);
      console.table(devServer.options.proxy, [
        "context",
        "target",
        "pathRewrite",
      ]);
      Logger.log();
    }
  });
}
module.exports = webpackServe;
