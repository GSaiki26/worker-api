// Libs
import cluster from "cluster";
import { cpus } from "os";

import LoggerFactory from "./logger/loggerFactory";
import DatabaseModel from "./models/databaseModel";
import ServerModel from "./models/serverModel";

// Data
const HOST = "0.0.0.0:3000";
const NUM_CPUS = cpus().length;

// Code
async function main() {
  // Do the migrations.
  const logger = LoggerFactory.createLogger("SERVER");

  // Start the server.
  if (cluster.isPrimary) {
    await DatabaseModel.migrations(logger);
    if (process.env.K8S_ENABLED == "false") {
      logger.info("K8S is not enabled. Forking clusters...");
      for (let i = 0; i < NUM_CPUS; i++) {
        cluster.fork();
      }
  
      cluster.on("exit", (worker, code) => {
        logger.info(`Worker $${worker.process.pid} exited with code #${code}`);
      });
    }
  } else {
    logger.info(`Started worker #${process.pid}`);
    ServerModel.startServer(HOST);
  }
}

main();
