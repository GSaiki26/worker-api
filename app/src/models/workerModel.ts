// Libs
import { randomUUID } from "crypto";
import { Model } from "sequelize";
import { Logger } from "winston";

import DatabaseModel from "@models/databaseModel";
import WorkerScheme from "./schemas/workerScheme";

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
  public async create(entry: any): Promise<Model> {
    this.logger.info("Trying to create the worker...");
    return await this.model.create(entry);
  }

  /**
   * A method to find a worker in the database.
   * @param query - The query to find the worker.
   */
  public async find(query: any): Promise<Model | null> {
    this.logger.info("Trying to find some worker...");
    return await this.model.findOne({
      where: query,
    });
  }

  /**
   * A method to find all workers in the database.
   */
  public async findAll(): Promise<Model[]> {
    this.logger.info("Trying to find all workers...");
    return await this.model.findAll();
  }

  /**
   * A method to update a worker in the database.
   * @param workerId - The workerId from the worker.
   * @param entry - The entry to update the worker.
   */
  public async update(workerId: string, entry: any): Promise<Model[]> {
    this.logger.info("Trying to update some worker...");
    const updateResult = await this.model.update(entry, {
      returning: true,
      where: {
        id: workerId,
      },
    });
    return updateResult[1];
  }

  /**
   * A method to delete a worker in the database.
   * @param query - The query to delete the worker.
   */
  public async delete(workerId: string): Promise<number> {
    this.logger.info("Trying to delete some worker...");
    return await this.model.destroy({
      where: {
        id: workerId,
      },
    });
  }
}

// Code
export default WorkerModel;
