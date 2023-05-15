// Libs
import sequelize from "sequelize";
import { Logger } from "winston";

import WorkerModel from "../models/workerModel";

// Class
/**
 * A database to be inherited from all models.
 */
class DatabaseModel {
  public static seq = new sequelize.Sequelize({
    host: "workers-db",
    port: 5432,
    dialect: "postgres",
    database: process.env.POSTGRES_USER,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    pool: {
      min: 1,
      max: 100,
      idle: 1000 * 6,
      acquire: 1000 * 6,
    },
    logging: false,
  });

  /**
   * A method to do the migrations the database.
   */
  public static async migrations(logger: Logger) {
    logger.info("Starting migrations...");

    await new WorkerModel(logger).sync();

    logger.info("The migrations has been completed.");
  }
}

// Code
export default DatabaseModel;
