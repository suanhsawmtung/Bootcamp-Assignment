import { NextFunction, Request, Response } from "express";
import { PaginatedResult, ServiceResponse } from "../../@types/common";
import { Concert } from "./concert.entity";

export interface IConcertService {
  getAllConcerts(page: number, limit: number): Promise<ServiceResponse<PaginatedResult<Concert>>>;
}

export interface IConcertController {
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
}
