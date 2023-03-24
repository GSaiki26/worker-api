// Libs
import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";

import LoggerFactory from "@logger";
import CredentialModel from "@models/credentialModel";

// Types
declare global {
  namespace Express {
    interface Request {
      logger: Logger;
      permission: "admin" | "user";
    }
  }
}

// Class
class AuthMiddleware {
  public static async auth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    // Add the logger to the request.
    req.logger = LoggerFactory.createLogger(req.ip);
    req.logger.info(`Request to ${req.method} ${req.url}`);

    // Check th provided bearer.
    const auth = req.headers.authorization;
    if (!auth || auth.split(" ").length < 2) {
      req.logger.info("Bad bearer. Returning...");
      return res.status(401).json({
        status: "Error",
        message: "Bad bearer.",
      });
    }

    // Check if the bearer is valid.
    const level = await CredentialModel.credLevel(
      req.logger,
      auth.split(" ")[1]
    );
    if (!level) {
      req.logger.info("Bad bearer. Returning...");
      return res.status(401).json({
        status: "Error",
        message: "Bad bearer.",
      });
    }

    req.logger.warn(`${level} logged in.`);
    req.permission = level as any;
    return next();
  }
}

// Code
export default AuthMiddleware;
