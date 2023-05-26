// Libs
import { randomUUID } from "crypto";
import { Model } from "sequelize";
import { Logger } from "winston";

import DatabaseModel from "../models/databaseModel";
import ProtoMessages from "../proto/worker_pb";
import WorkerScheme from "./schemas/workerScheme";

import * as types from "../types/types";

// Class
class WorkerModel {
  private logger: Logger;
  private model = DatabaseModel.seq.define<Model<types.DbWorker>>(
    "workers",
    WorkerScheme
  );

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * A method to sync the database.
   */
  public async sync(): Promise<void> {
    this.logger.info("Syncing workers table...");
    await this.model.sync();
    this.logger.info("workers table synced.");
  }

  /**
   * A method to create a worker in the database.
   * @param entry - The entry to create the worker.
   */
  public async create(
    entry: ProtoMessages.CreateReq
  ): Promise<Model<types.DbWorker>> {
    this.logger.info(
      `Trying to create the worker ${entry.getFirstname()} ${entry.getLastname()}...`
    );
    return await this.model.create({
      id: randomUUID(),
      card_id: entry.getCardid(),
      email: entry.getEmail(),
      first_name: entry.getFirstname(),
      last_name: entry.getLastname(),
    } as any);
  }

  /**
   * A method to find a worker in the database.
   * @param query - The query to find the worker.
   */
  public async find(workerId: string): Promise<Model<types.DbWorker> | null> {
    this.logger.info(`Trying to get the worker #${workerId}`);
    return await this.model.findOne({
      where: {
        id: workerId,
      },
    });
  }

  /**
   * A method to find a worker in the database using his cardId.
   * @param query - The query to find the worker.
   */
  public async findByCardId(
    cardId: string
  ): Promise<Model<types.DbWorker> | null> {
    this.logger.info(`Trying to get the worker with the card id #${cardId}`);
    return await this.model.findOne({
      where: {
        card_id: cardId,
      },
    });
  }

  /**
   * A method to update a worker in the database.
   * @param workerId - The workerId from the worker.
   * @param entry - The entry to update the worker.
   */
  public async update(
    workerId: string,
    entry: ProtoMessages.UpdateByIdReq
  ): Promise<Model<types.DbWorker> | undefined> {
    const propertiesCount = Object.keys(entry);
    this.logger.info(
      `Trying to update ${propertiesCount} properties to worker #${workerId}`
    );

    // Treat the entry to the DbWorker format.
    const updatedEntry: types.DbWorker = {} as any;
    if (entry.getCardid()) updatedEntry.card_id = entry.getCardid();
    if (entry.getEmail()) updatedEntry.email = entry.getEmail();
    if (entry.getFirstname()) updatedEntry.first_name = entry.getFirstname();
    if (entry.getLastname()) updatedEntry.last_name = entry.getLastname();

    const updateResult = await this.model.update(updatedEntry, {
      returning: true,
      where: {
        id: workerId,
      },
    });
    if (updateResult[1].length) return updateResult[1][0];
    return;
  }

  /**
   * A method to delete a worker in the database.
   * @param query - The query to delete the worker.
   */
  public async delete(workerId: string): Promise<number> {
    this.logger.info(`Trying to delete the worker #${workerId}...`);
    return await this.model.destroy({
      where: {
        id: workerId,
      },
    });
  }
}

// Code
export default WorkerModel;
