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
    // Check if the permission is admin.
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
   * PATCH /worker/:workerId
   *
   * Body: firstName, lastName, email
   */
  public static async patch(req: Request, res: Response): Promise<any> {
    // Check if the permission is admin.
    if (req.permission != "admin") {
      req.logger.warn("Elevated permissions required. Returning...");
      return res.sendStatus(403);
    }

    // Treat the request's body.
    // Add the keys from the request's body to the params.
    const params: any = {};
    if (req.body.firstName) params.first_name = req.body.firstName;
    if (req.body.lastName) params.last_name = req.body.lastName;
    if (req.body.email) params.email = req.body.email;

    try {
      // Update the worker.
      const updatedWorker = await new WorkerModel(req.logger).update(
        req.params.workerId,
        params
      );

      if (!updatedWorker.length) throw "Any worker was updated.";

      req.logger.warn(`1 worker were updated. Returning...`);
      res.status(200).json({
        status: "Success",
        data: updatedWorker,
      });
    } catch (err) {
      req.logger.warn(`Couldn\'t update the worker. Error: ${err}`);
      res.status(400).json({
        status: "Error",
        message: "Invalid request.",
      });
    }
  }

  /**
   * DELETE /worker/:workerId
   */
  public static async delete(req: Request, res: Response): Promise<any> {
    // Check if the permission is admin.
    if (req.permission != "admin") {
      req.logger.warn("Elevated permissions required. Returning...");
      return res.sendStatus(403);
    }

    // Try to delete the worker.
    try {
      const deletedRows = await new WorkerModel(req.logger).delete(
        req.params.workerId
      );
      if (!deletedRows) throw "No worker deleted.";

      req.logger.warn("Worker deleted. Returning...");
      res.sendStatus(204);
    } catch (err) {
      req.logger.warn(`Couldn\'t delete the worker.Error: ${err}`);
      return res.status(400).json({
        status: "Error",
        message: "Invalid Request.",
      });
    }
  }
}

// Code
export default WorkerController;
