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
      return res.status(403).json({
        status: "Error",
        message: "Elevated permissions required.",
      });
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
   * GET /worker/
   */
  public static async get(req: Request, res: Response): Promise<any> {}

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
