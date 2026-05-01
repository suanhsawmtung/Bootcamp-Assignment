// src/modules/concert/concert.controller.ts
import { NextFunction, Request, Response } from "express";
import { ConcertService } from "./concert.service";
import { IConcertController } from "./concert.interface";

export class ConcertController implements IConcertController {
  private concertService = new ConcertService();

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.concertService.getAllConcerts(page, limit);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}