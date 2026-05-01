import express, { type Router } from "express";
import { ConcertController } from "./concert.controller";

const router: Router = express.Router();

const controller = new ConcertController();

router.get("/", controller.getAll);

export default router;
