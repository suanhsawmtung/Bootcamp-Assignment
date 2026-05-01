import { NextFunction, Request, Response } from "express";
import { ServiceResponse } from "../../@types/common";
import { Reservation } from "./reservation.entity";
import { CreateReservationParams, PurchaseReservationParams } from "./reservation.type";

export interface IReservationService {
  reserve(params: CreateReservationParams): Promise<ServiceResponse<Reservation>>;
  purchase(params: PurchaseReservationParams): Promise<ServiceResponse<Reservation>>;
  releaseExpiredReservations(): Promise<ServiceResponse<number>>;
}

export interface IReservationController {
  reserve(req: Request, res: Response, next: NextFunction): Promise<void>;
  purchase(req: Request, res: Response, next: NextFunction): Promise<void>;
}
