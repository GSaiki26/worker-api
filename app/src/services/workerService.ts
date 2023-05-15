// Libs
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { Model } from "sequelize";

import LoggerFactory from "../logger/loggerFactory";
import WorkerModel from "../models/workerModel";
import SecurityModel from "../models/securityModel";

import * as workerTypes from "../types/workerTypes";

// Class
class WorkerService {
  /**
   * A method to create some worker.
   */
  public static async create(
    call: ServerUnaryCall<workerTypes.CreateReq, any>,
    cb: sendUnaryData<workerTypes.DefaultRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: '${call.getPath()}'.`);

    // Check the request's body.
    const { firstName, lastName, email, cardId } = call.request;
    if (SecurityModel.isValidWorker(call.request)) {
      logger.info("The request's body is invalid. Returning...");
      return cb({
        name: "400",
        message: "Invalid request.",
      });
    }

    // Create the worker.
    let worker: Model;
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
    cb(null, {
      data: worker.toJSON(),
    });
  }

  /**
   * A method to get some worker using his id.
   */
  public static async getById(
    call: ServerUnaryCall<workerTypes.GetByIdReq, any>,
    cb: sendUnaryData<workerTypes.DefaultRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: '${call.getPath()}'.`);

    // Search the worker in the database.
    let worker: Model | null;
    try {
      const workerId = call.request.id;
      logger.info(`Trying to get the worker #${call.request.id}`);

      worker = await new WorkerModel(logger).find({
        id: workerId,
      });
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
      data: worker.toJSON(),
    });
  }

  /**
   * A method to get some worker using his cardId.
   */
  public static async getByCardId(
    call: ServerUnaryCall<workerTypes.GetByCardIdReq, any>,
    cb: sendUnaryData<workerTypes.DefaultRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: '${call.getPath()}'`);

    // Search the worker in the database.
    let worker: Model | null;
    try {
      const cardId = call.request.cardId;
      logger.info(`Trying to find the worker with the card id: #${cardId}`);

      worker = await new WorkerModel(logger).find({
        card_id: cardId,
      });
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
      data: worker.toJSON(),
    });
  }

  /**
   * A method to update a worker using his id.
   */
  public static async updateById(
    call: ServerUnaryCall<workerTypes.UpdateByIdReq, any>,
    cb: sendUnaryData<workerTypes.DefaultRes>
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
      logger.info(
        `Trying to update ${Object.keys(
          params
        )} properties to worker #${workerId}`
      );

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
      data: updatedWorker.toJSON(),
    });
  }

  /**
   * A method to delete some worker using his id.
   */
  public static async deleteById(
    call: ServerUnaryCall<workerTypes.DeleteByIdReq, any>,
    cb: sendUnaryData<workerTypes.DeleteByIdRes>
  ): Promise<any> {
    // Define the logger.
    const logger = LoggerFactory.createLogger(call.getPeer());
    logger.info(`Request to: ${call.getPath()}`);

    // Try to delete the worker.
    try {
      const workerId = call.request.id;
      logger.info(`Trying to delete the worker #${workerId}...`);
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
