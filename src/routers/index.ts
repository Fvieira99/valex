import { Router } from "express";
import cardsRouter from "./cardRouter.js";
import rechargeRouter from "./rechargeRouter.js";
import paymentRouter from "./paymentRouter.js";

const router = Router();

router.use(cardsRouter);
router.use(rechargeRouter);
router.use(paymentRouter);
export default router;
