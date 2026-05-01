import express, { type Router } from "express";
import { handleValidationError } from "../../middlewares/error-handler";
import { ReservationController } from "./reservation.controller";
import { purchaseValidation, reserveValidation } from "./reservation.validation";

const router: Router = express.Router();

const controller = new ReservationController();

router.post(
    "/reserve",
    reserveValidation, 
    handleValidationError,
    controller.reserve
);

router.post(
    "/purchase",
    purchaseValidation,
    handleValidationError,
    controller.purchase
);

export default router;
