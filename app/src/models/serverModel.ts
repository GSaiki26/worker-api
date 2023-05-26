// Libs
import { readFileSync } from "fs";

import * as grpc from "@grpc/grpc-js";
import { Logger } from "winston";

import LoggerFactory from "../logger/loggerFactory";
import ProtoServices from "../proto/worker_grpc_pb";
import WorkerService from "../services/workerService";

// Class
class ServerModel {
  private static logger: Logger = LoggerFactory.createLogger("SERVER");
  private static server: grpc.Server = new grpc.Server();

  /**
   * A method to start the server.
   */
  public static startServer(host: string): void {
    ServerModel.defineServices();
    ServerModel.server.bindAsync(
      host,
      ServerModel.getCredentials(),
      (err, port) => {
        if (err) {
          ServerModel.logger.error(
            "Error while trying to start the server. " + err
          );
          return;
        }

        ServerModel.server.start();
        ServerModel.logger.info("Server started on port: " + port);
      }
    );
  }

  /**
   * A method to define the services used by the server.
   */
  private static defineServices(): void {
    ServerModel.server.addService(ProtoServices.WorkerServiceService as any, {
      create: WorkerService.create,
      deleteById: WorkerService.deleteById,
      getByCardId: WorkerService.getByCardId,
      getById: WorkerService.getById,
      updateById: WorkerService.updateById,
    });
  }

  /**
   * A method to define and get the server's credentials.
   */
  private static getCredentials(): grpc.ServerCredentials {
    return grpc.ServerCredentials.createSsl(
      readFileSync("./certs/ca.pem"),
      [
        {
          cert_chain: readFileSync("./certs/server.pem"),
          private_key: readFileSync("./certs/server.pem.key"),
        },
      ],
      true
    );
  }
}

// Code
export default ServerModel;
