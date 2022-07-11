import { Router } from "express";
import { pay } from "../controllers/paymentController.js";

const paymentRouter = Router();

paymentRouter.post("/payment", pay);

export default paymentRouter;
