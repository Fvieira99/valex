import { Router } from "express";
import validateAPIKey from "../middlewares/authMiddleware.js";
import { createCard, activateCard } from "../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/cards", validateAPIKey, createCard);
cardsRouter.put("/cards", validateAPIKey, activateCard);

export default cardsRouter;
