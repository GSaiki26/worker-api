// Libs
import WorkerModel from "@models/workerModel";
import { Request, Response } from "express";

// Class
class WorkerController {
  /**
   * POST /worker/
   */
  public static async post(req: Request, res: Response): Promise<any> {
    // Check if the level is admin.
    if (req.permission != "admin") {
      req.logger.warn("Insuficient permission. Returning...");
      return res.sendStatus(403);
    }

    // Check the request's body.
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      req.logger.info("The request's body is invalid. Returning...");
      return res.status(400).json({
        status: "Error",
        message: "Invalid body.",
      });
    }

    // Create the worker.
    try {
      const worker = await new WorkerModel(req.logger).create({
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
      return res.status(201).json({
        status: "Success",
        data: worker.toJSON(),
      });
    } catch (err) {
      req.logger.warn(`Couldn\'t create the worker. Error: ${err}`);
      return res.status(400).json({
        status: "Error",
        message: "Invalid body.",
      });
    }
  }

  /**
   * GET /worker/:workerId
   */
  public static async get(req: Request, res: Response): Promise<any> {
    try {
      // Search the worker in the database.
      const worker = await new WorkerModel(req.logger).find({
        id: req.params.workerId,
      });
      if (!worker) throw "No worker found.";

      req.logger.info("The worker was found. Returning...");
      res.status(200).json({
        status: "Success",
        data: worker.toJSON(),
      });
    } catch (err) {
      req.logger.info("Couldn't found any worker. Returning...");
      return res.status(400).json({
        status: "Error",
        message: err,
      });
    }
  }

  /**
   * GET /worker/
   */
  public static async getAll(req: Request, res: Response): Promise<any> {
    // Check if the level is admin.
    if (req.permission != "admin") {
      req.logger.warn("Elevated permissions required. Returning...");
      return res.sendStatus(403);
    }

    try {
      // Search the query in the database.
      const workers = await new WorkerModel(req.logger).findAll();

      req.logger.info(`Found ${workers.length} workers. Returning...`);
      res.status(200).json({
        status: "Success",
        data: workers,
      });
    } catch (err) {
      req.logger.error(`Couldn\'t search in the database. Error: ${err}`);
      res.sendStatus(500);
    }
  }

  /**
   * PATCH /worker/
   */
  public static async patch(req: Request, res: Response): Promise<any> {}

  /**
   * DELETE /worker/
   */
  public static async delete(req: Request, res: Response): Promise<any> {}
}

// Code
export default WorkerController;
