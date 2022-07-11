import { Router } from "express";
import validateAPIKey from "../middlewares/authMiddleware.js";
import {
  createCard,
  activateCard,
  blockCard,
  unblockCard,
  getCardStatement
} from "../controllers/cardController.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import createCardSchema from "../schemas/createCardSchema.js";
import activateCardSchema from "../schemas/activateCardSchema.js";
import blockCardSchema from "../schemas/blockCardSchema.js";

const cardsRouter = Router();

cardsRouter.post(
  "/cards",
  validateAPIKey,
  validateSchema(createCardSchema),
  createCard
);
cardsRouter.put(
  "/cards/activate",
  validateSchema(activateCardSchema),
  activateCard
);
cardsRouter.put("/cards/block", validateSchema(blockCardSchema), blockCard);
cardsRouter.put("/cards/unblock", validateSchema(blockCardSchema), unblockCard);
cardsRouter.get("/cards/:cardId/statement", getCardStatement);

export default cardsRouter;
