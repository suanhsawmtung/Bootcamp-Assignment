// src/modules/reservation/reservation.controller.ts
import { NextFunction, Request, Response } from "express";
import { IReservationController } from "./reservation.interface";
import { ReservationService } from "./reservation.service";

export class ReservationController implements IReservationController {
  private reservationService = new ReservationService();

  reserve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.body, 'test')
      const { userId, ticketId } = req.body;

      const result = await this.reservationService.reserve({
        userId: Number(userId),
        ticketId: Number(ticketId)
      });

      res.status(201).json(result);
    } catch (err: any) {
      console.log(err);
      return next(err);
    }
  };

  purchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, ticketId } = req.body;

      const result = await this.reservationService.purchase({
        userId: Number(userId),
        ticketId: Number(ticketId)
      });

      res.status(200).json(result);
    } catch (err: any) {
      return next(err);
    }
  };
}