import express, { type Router } from "express";
import concertRoutes from "../../modules/concert/concert.routes";
import reservationRoutes from "../../modules/reservation/reservation.routes";

const router: Router = express.Router();

router.use("/concerts", concertRoutes);
router.use("/reservations", reservationRoutes);

export default router;