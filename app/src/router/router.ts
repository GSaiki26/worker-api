// Libs
import { Request, Response, Router } from "express";

import AuthMiddleware from "@middlewares/authMiddleware";
import WorkerController from "@controllers/workerController";

// Data
const router = Router();
router.use(AuthMiddleware.auth);

// Routes
router.post("/worker/", WorkerController.post.bind(WorkerController));
router.get("/worker/:workerId", WorkerController.get.bind(WorkerController));
router.patch(
  "/worker/:workerId",
  WorkerController.patch.bind(WorkerController)
);
router.delete(
  "/worker/:workerId",
  WorkerController.delete.bind(WorkerController)
);

router.all("*", (req: Request, res: Response) => {
  req.logger.info("Route not found. Returning...");
  res.status(304).json({
    status: 'Error',
    message: 'Not found.'
  });
});

// Code
export default router;
