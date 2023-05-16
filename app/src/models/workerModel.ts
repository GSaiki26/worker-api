// Libs
import { randomUUID } from "crypto";
import { Model } from "sequelize";
import { Logger } from "winston";

import DatabaseModel from "../models/databaseModel";
import WorkerScheme from "./schemas/workerScheme";

import * as types from "../types/types";

// Class
class WorkerModel {
  private logger: Logger;
  private model = DatabaseModel.seq.define("workers", WorkerScheme);

  constructor(logger: Logger) {
    this.logger = logger;
    this.model.beforeCreate("workers", (worker) => {
      (worker as any).id = randomUUID();
    });
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
  public async create(entry: any): Promise<Model<types.DbWorker>> {
    this.logger.info(
      `Trying to create the worker ${entry.first_name} ${entry.last_name}...`
    );
    return await this.model.create(entry);
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
    entry: any
  ): Promise<Model<types.DbWorker> | undefined> {
    const propertiesCount = Object.keys(entry);
    this.logger.info(
      `Trying to update ${propertiesCount} properties to worker #${workerId}`
    );
    const updateResult = await this.model.update(entry, {
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
