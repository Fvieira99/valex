import { Router } from "express";
import { recharge } from "../controllers/rechargeController.js";
import validateAPIKey from "../middlewares/authMiddleware.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import rechargeCardSchema from "../schemas/rechargeCardSchema.js";

const rechargeRouter = Router();

rechargeRouter.post(
  "/recharge",
  validateAPIKey,
  validateSchema(rechargeCardSchema),
  recharge
);

export default rechargeRouter;
