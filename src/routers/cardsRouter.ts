import { Router } from "express";
import validateAPIKey from "../middlewares/authMiddleware.js";
import { createCard } from "../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/cards", validateAPIKey, createCard);

export default cardsRouter;
