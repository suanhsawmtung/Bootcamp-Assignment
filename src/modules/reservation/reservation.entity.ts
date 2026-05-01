// src/modules/reservation/reservation.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "../ticket/ticket.entity";

export enum ReservationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

@Entity("reservations")
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  userId!: number;

  @Column({ type: "int" })
  ticketId!: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.reservations)
  @JoinColumn({ name: "ticketId" })
  ticket!: Ticket;

  @Index("idx_reservations_status", { where: "status = 'PENDING'" })
  @Column({ type: "varchar", enum: ReservationStatus, default: ReservationStatus.PENDING })
  status!: ReservationStatus;

  @Column({ type: "datetime" })
  expiresAt!: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}