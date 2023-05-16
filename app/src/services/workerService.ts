// Libs
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { Model } from "sequelize";

import LoggerFactory from "../logger/loggerFactory";
import WorkerModel from "../models/workerModel";
import SecurityModel from "../models/securityModel";

import * as types from "../types/types";

// Class
class WorkerService {
  /**
   * A method to create some worker.
   */
  public static async create(
    call: ServerUnaryCall<types.ProtoCreateReq, any>,
    cb: sendUnaryData<types.ProtoDefaultRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: '${call.getPath()}'.`);

    // Check the request's body.
    const { firstName, lastName, email, cardId } = call.request;
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
      worker = await new WorkerModel(logger).create({
        first_name: firstName,
        last_name: lastName,
        email: email,
        card_id: cardId,
      });
    } catch (err) {
      logger.warn("Couldn't create the worker. " + err);
      return cb({
        name: "400",
        message: "Invalid request.",
      });
    }

    // Return the worker.
    logger.info(`Returning the worker #${worker.toJSON().id} to the client...`);
    cb(null, {
      data: SecurityModel.workerToPublicWorker(worker.toJSON()),
    });
  }

  /**
   * A method to get some worker using his id.
   */
  public static async getById(
    call: ServerUnaryCall<types.ProtoGetByIdReq, any>,
    cb: sendUnaryData<types.ProtoDefaultRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: '${call.getPath()}'.`);

    // Search the worker in the database.
    let worker: Model<types.DbWorker> | null;
    try {
      const workerId = call.request.id;

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

    cb(null, {
      data: SecurityModel.workerToPublicWorker(worker.toJSON()),
    });
  }

  /**
   * A method to get some worker using his cardId.
   */
  public static async getByCardId(
    call: ServerUnaryCall<types.ProtoGetByCardIdReq, any>,
    cb: sendUnaryData<types.ProtoDefaultRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: '${call.getPath()}'`);

    // Search the worker in the database.
    let worker: Model | null;
    try {
      const cardId = call.request.cardId;

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

    cb(null, {
      data: SecurityModel.workerToPublicWorker(worker.toJSON()),
    });
  }

  /**
   * A method to update a worker using his id.
   */
  public static async updateById(
    call: ServerUnaryCall<types.ProtoUpdateByIdReq, any>,
    cb: sendUnaryData<types.ProtoDefaultRes>
  ): Promise<any> {
    // Define the logger
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: ${call.getPath()}`);

    // Treat the request's body.
    // Add the keys from the request's body to the params.
    const params: any = {};
    if (SecurityModel.isValidProperty(call.request.cardId!))
      params.first_name = call.request.cardId;
    if (SecurityModel.isValidProperty(call.request.firstName!))
      params.first_name = call.request.firstName;
    if (SecurityModel.isValidProperty(call.request.lastName!))
      params.last_name = call.request.lastName;
    if (SecurityModel.isValidEmail(call.request.email!))
      params.email = call.request.email;

    // Update the worker.
    let updatedWorker: Model | undefined;
    try {
      const workerId = call.request.id;
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
    cb(null, {
      data: SecurityModel.workerToPublicWorker(updatedWorker.toJSON()),
    });
  }

  /**
   * A method to delete some worker using his id.
   */
  public static async deleteById(
    call: ServerUnaryCall<types.ProtoDeleteByIdReq, any>,
    cb: sendUnaryData<types.ProtoDeleteByIdRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: ${call.getPath()}`);

    // Try to delete the worker.
    try {
      const workerId = call.request.id;
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
    cb(null, {
      status: "Success",
    });
  }
}

// Code
export default WorkerService;
