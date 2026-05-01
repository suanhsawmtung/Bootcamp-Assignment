// src/modules/concert/concert.service.ts
import { PaginatedResult, ServiceResponse } from "../../@types/common";
import { AppDataSource } from "../../database";
import { Concert } from "./concert.entity";
import { IConcertService } from "./concert.interface";

export class ConcertService implements IConcertService {
  private concertRepo = AppDataSource.getRepository(Concert);

  async getAllConcerts(
    page: number = 1, 
    limit: number = 10
  ): Promise<ServiceResponse<PaginatedResult<Concert>>> {
    const [items, totalItems] = await this.concertRepo.findAndCount({
      relations: ["tickets"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: {
        items,
        meta: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
        },
      },
      success: true,
      message: null,
    };
  }
}