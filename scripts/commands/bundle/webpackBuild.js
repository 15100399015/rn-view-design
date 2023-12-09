const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const loadEnvFile = require("../../utils/loadEnvFile");
const { Logger, preCheck } = require("../../utils/utils");

function webpackBuild(options, config) {
  loadEnvFile("production", config);
  preCheck(config.pathConfigs);
  const webpackConfig = require(config["production"].webpackConfigFile);
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      Logger.logError(err.stack || err);
      if (err.details) {
        Logger.logError(err.details);
      }
      return;
    }

    const statsData = stats.toJson({
      preset: "normal",
    });

    const isSuccessful = !statsData.errors.length && !statsData.warnings.length;

    if (isSuccessful) {
      // successfully
      Logger.log(`${Logger.blue(config.appName)} Build Successfully`);
      Logger.log(
        "----------------------------------------------------------------"
      );
      // app version
      Logger.log(Logger.green("app version:      ", true), config.appVersion);
      // webpack 版本
      Logger.log(Logger.green("webpack version:  ", true), statsData.version);
      // 执行时间
      Logger.log(
        Logger.green("take time:        ", true),
        statsData.time,
        "ms"
      );
      // 输出路径信息
      Logger.log(
        Logger.green("output path:      ", true),
        statsData.outputPath
      );
      // 生成资源的信息
      Logger.log(
        Logger.green("generate assets:  ", true),
        statsData.assets.length
      );
      // chunk 数量
      Logger.log(
        Logger.green("generate chunks:  ", true),
        statsData.chunks.length
      );
      // 处理过的module数量
      Logger.log(
        Logger.green("filter modules:   ", true),
        statsData.modules.length
      );
      Logger.log(
        "----------------------------------------------------------------"
      );
    } else {
      if (stats.hasErrors()) {
        statsData.errors.forEach((error) => {
          Logger.logWarn(error.message);
        });
      }

      if (stats.hasWarnings()) {
        statsData.warnings.forEach((warn) => {
          Logger.logWarn(warn.message);
        });
      }
    }

    compiler.close((closeErr) => {
      if (closeErr) {
        Logger.logError(closeErr);
      } else {
        Logger.logInfo("Compiler Close");
        publishToServer(
          statsData.outputPath,
          path.join(config.contextDir, "../server/public")
        );
      }
    });
  });
}

function publishToServer(outputPath, servePublicPath) {
  Logger.logInfo("Start Publish to Server");
  fs.cpSync(outputPath, servePublicPath, {
    recursive: true,
  });
  Logger.logSuccess("Publish to Server Finish");
}

module.exports = webpackBuild;
