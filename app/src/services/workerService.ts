// Libs
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { Model } from "sequelize";

import LoggerFactory from "../logger/loggerFactory";

import ProtoMessages from "../proto/worker_pb";
import SecurityModel from "../models/securityModel";
import WorkerModel from "../models/workerModel";

// Types
import * as types from "../types/types";

// Class
class WorkerService {
  /**
   * A method to create some worker.
   */
  public static async create(
    call: ServerUnaryCall<ProtoMessages.CreateReq, any>,
    cb: sendUnaryData<ProtoMessages.DefaultRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: '${call.getPath()}'.`);

    // Check the request's body.
    if (!SecurityModel.isValidWorker(call.request)) {
      logger.info("The request's body is invalid. Returning...");
      return cb({
        name: "400",
        message: "Invalid request.",
      });
    }

    // Create the worker.
    let worker: Model<types.DbWorker>;
    try {
      worker = await new WorkerModel(logger).create(call.request);
    } catch (err) {
      logger.warn("Couldn't create the worker. " + err);
      return cb({
        name: "400",
        message: "Invalid request.",
      });
    }

    // Return the worker.
    logger.info(`Returning the worker #${worker.toJSON().id} to the client...`);
    const response = new ProtoMessages.DefaultRes().setData(
      SecurityModel.workerToPublicWorker(worker.toJSON())
    );

    cb(null, response);
  }

  /**
   * A method to get some worker using his id.
   */
  public static async getById(
    call: ServerUnaryCall<ProtoMessages.GetByIdReq, any>,
    cb: sendUnaryData<ProtoMessages.DefaultRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: '${call.getPath()}'.`);

    // Search the worker in the database.
    let worker: Model<types.DbWorker> | null;
    try {
      const workerId = call.request.getId();

      worker = await new WorkerModel(logger).find(workerId);
      if (!worker) throw "Invalid request.";
    } catch (err) {
      logger.warn("Couldn't found any worker. " + err);
      return cb({
        name: "400",
        message: "Invalid request.",
      });
    }

    // Return the worker to the client.
    logger.info(`The worker #${worker.toJSON().id} was found. Returning...`);
    const response = new ProtoMessages.DefaultRes().setData(
      SecurityModel.workerToPublicWorker(worker.toJSON())
    );

    cb(null, response);
  }

  /**
   * A method to get some worker using his cardId.
   */
  public static async getByCardId(
    call: ServerUnaryCall<ProtoMessages.GetByCardIdReq, any>,
    cb: sendUnaryData<ProtoMessages.DefaultRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: '${call.getPath()}'`);

    // Search the worker in the database.
    let worker: Model | null;
    try {
      const cardId = call.request.getCardid();

      worker = await new WorkerModel(logger).findByCardId(cardId);
      if (!worker) throw "No worker with the provided card found.";
    } catch (err) {
      logger.info("Couldn't found any worker with that card. " + err);
      return cb({
        name: "400",
        message: "Invalid request.",
      });
    }

    // Return the worker to the client.
    logger.info("The card's worker was found. Returning...");
    const response = new ProtoMessages.DefaultRes().setData(
      SecurityModel.workerToPublicWorker(worker.toJSON())
    );

    cb(null, response);
  }

  /**
   * A method to update a worker using his id.
   */
  public static async updateById(
    call: ServerUnaryCall<ProtoMessages.UpdateByIdReq, any>,
    cb: sendUnaryData<ProtoMessages.DefaultRes>
  ): Promise<any> {
    // Define the logger
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: ${call.getPath()}`);

    // Treat the request's body.
    // Add the keys from the request's body to the params.
    const params: any = {};
    if (SecurityModel.isValidProperty(call.request.getCardid()))
      params.first_name = call.request.getCardid();
    if (SecurityModel.isValidProperty(call.request.getFirstname()))
      params.first_name = call.request.getFirstname();
    if (SecurityModel.isValidProperty(call.request.getLastname()))
      params.last_name = call.request.getLastname();
    if (SecurityModel.isValidEmail(call.request.getEmail()))
      params.email = call.request.getEmail();

    // Update the worker.
    let updatedWorker: Model | undefined;
    try {
      const workerId = call.request.getId();
      updatedWorker = await new WorkerModel(logger).update(workerId, params);

      if (!updatedWorker) throw "Any worker was updated.";
    } catch (err) {
      logger.warn("Couldn't update the worker. " + err);
      return cb({
        name: "400",
        message: "Invalid request.",
      });
    }

    // Return the updated worker to the client.
    logger.info(`1 worker were updated. Returning...`);
    const response = new ProtoMessages.DefaultRes().setData(
      SecurityModel.workerToPublicWorker(updatedWorker.toJSON())
    );
    cb(null, response);
  }

  /**
   * A method to delete some worker using his id.
   */
  public static async deleteById(
    call: ServerUnaryCall<ProtoMessages.DeleteByIdReq, any>,
    cb: sendUnaryData<ProtoMessages.DeleteByIdRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: ${call.getPath()}`);

    // Try to delete the worker.
    try {
      const workerId = call.request.getId();
      const deletedRows = await new WorkerModel(logger).delete(workerId);

      if (!deletedRows) throw "No worker deleted.";
    } catch (err) {
      logger.warn("Couldn't delete the worker. " + err);
      return cb({
        name: "400",
        message: "Invalid request.",
      });
    }

    // Return the response to the client.
    cb(null, new ProtoMessages.DeleteByIdRes().setStatus("Success"));
  }
}

// Code
export default WorkerService;
