// src/modules/reservation/reservation.service.ts
import { LessThan } from "typeorm";
import { ServiceResponse } from "../../@types/common";
import { errorCode } from "../../config/error-code";
import { AppDataSource } from "../../database";
import { createError } from "../../utils/error";
import { Ticket } from "../ticket/ticket.entity";
import { Reservation, ReservationStatus } from "./reservation.entity";
import { IReservationService } from "./reservation.interface";
import { CreateReservationParams, PurchaseReservationParams } from "./reservation.type";

export class ReservationService implements IReservationService {

  async reserve({ userId, ticketId }: CreateReservationParams): Promise<ServiceResponse<Reservation>> {
    console.log("hit oop")
    return AppDataSource.transaction(async (manager) => {
      // 1. lock the ticket row to prevent race conditions
      const ticket = await manager.findOne(Ticket, {
        where: { id: ticketId },
      });

      // 2. ticket not found
      if (!ticket) {
        throw createError({ message: "Ticket not found", status: 404, code: errorCode.notFound });
      }

      // 3. check stock — rule: if stock is 0, fail
      if (ticket.availableStock <= 0) {
        throw createError({ message: "Ticket is out of stock", status: 409, code: errorCode.outOfStock });
      }

      // 4. decrement stock
      ticket.availableStock -= 1;
      await manager.save(ticket);

      // 5. create reservation with 5 min expiry
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      const reservation = manager.create(Reservation, {
        userId,
        ticketId,
        status: ReservationStatus.PENDING,
        expiresAt,
      });

      const savedReservation = await manager.save(reservation);
      return {
        data: savedReservation,
        success: true,
        message: "Ticket reserved successfully",
      };
    });
  }

  async purchase({ ticketId, userId }: PurchaseReservationParams): Promise<ServiceResponse<Reservation>> {
    return AppDataSource.transaction(async (manager) => {
      // 1. find the reservation
      const reservation = await manager.findOne(Reservation, {
        where: {
          ticketId,
          userId,
          status: ReservationStatus.PENDING
        },
        relations: ["ticket"],
      });

      // 2. not found
      if (!reservation) {
        throw createError({ message: "Reservation not found", status: 404, code: errorCode.notFound });
      }

      // 3. check if reservation has expired
      if (new Date() > reservation.expiresAt) {
        throw createError({ message: "Reservation has expired", status: 410, code: errorCode.expired });
      }

      // 4. convert to COMPLETED
      const savedReservation = await manager.save(reservation);
      return {
        data: savedReservation,
        success: true,
        message: "Ticket purchased successfully",
      };
    });
  }

  // cleanup method
  async releaseExpiredReservations(): Promise<ServiceResponse<number>> {
    return AppDataSource.transaction(async (manager) => {
      // 1. find all expired PENDING reservations
      const expiredReservations = await manager.find(Reservation, {
        where: {
          status: ReservationStatus.PENDING,
          expiresAt: LessThan(new Date()),
        },
        relations: ["ticket"],
      });

      if (expiredReservations.length === 0) {
        return {
          data: 0,
          success: true,
          message: "No expired reservations found",
        };
      }

      // 2. group by ticketId to batch increment stock
      const stockMap = new Map<number, number>();

      for (const reservation of expiredReservations) {
        const current = stockMap.get(reservation.ticketId) ?? 0;
        stockMap.set(reservation.ticketId, current + 1);
      }

      // 3. increment availableStock for each affected ticket
      for (const [ticketId, count] of stockMap.entries()) {
        await manager.increment(Ticket, { id: ticketId }, "availableStock", count);
      }

      // 4. mark all expired reservations as EXPIRED
      const expiredIds = expiredReservations.map((r) => r.id);
      await manager.update(Reservation, expiredIds, {
        status: ReservationStatus.EXPIRED,
      });

      return {
        data: expiredReservations.length,
        success: true,
        message: `Successfully released ${expiredReservations.length} reservation(s)`,
      };
    });
  }
}