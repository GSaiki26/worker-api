// Libs
import { readFileSync } from "fs";

import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { Logger } from "winston";

import LoggerFactory from "../logger/loggerFactory";
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
    const workerDef = ServerModel.getWorkerDefinition();
    ServerModel.server.addService(workerDef.WorkerService.service, {
      Create: WorkerService.create,
      DeleteById: WorkerService.deleteById,
      GetByCardId: WorkerService.getByCardId,
      GetById: WorkerService.getById,
      UpdateById: WorkerService.updateById,
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

  /**
   * A method to get the worker proto definifion.
   */
  private static getWorkerDefinition(): any {
    // Load the proto.
    const workerProto = loadSync("./proto/worker.proto");
    return grpc.loadPackageDefinition(workerProto).worker;
  }
}

// Code
export default ServerModel;
