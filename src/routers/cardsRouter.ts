import { Router } from "express";
import validateAPIKey from "../middlewares/authMiddleware.js";
import {
  createCard,
  activateCard,
  blockCard,
  unblockCard
} from "../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/cards", validateAPIKey, createCard);
cardsRouter.put("/cards/activate", activateCard);
cardsRouter.put("/cards/block", blockCard);
cardsRouter.put("/cards/unblock", unblockCard);

export default cardsRouter;
