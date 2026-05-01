// src/modules/ticket/ticket.entity.ts
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Concert } from "../concert/concert.entity";
import { Reservation } from "../reservation/reservation.entity";
import { TicketCategory } from "../ticket-category/ticket-category.entity";

@Entity("tickets")
export class Ticket {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index("IDX_TICKET_CONCERT_ID")
  @Column({ type: "int" })
  concertId!: number;

  @ManyToOne(() => Concert, (concert) => concert.tickets)
  @JoinColumn({ name: "concertId" })
  concert!: Concert;

  @Column()
  name!: string; 

  @Column({ unique: true })
  ticketCode!: string;

  @Column({ type: "int", nullable: true })
  categoryId?: number;

  @ManyToOne(() => TicketCategory, (category) => category.tickets)
  @JoinColumn({ name: "categoryId" })
  category?: TicketCategory;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "int" })
  totalStock!: number;

  @Column({ type: "int" })
  availableStock!: number;

  @OneToMany(() => Reservation, (reservation) => reservation.ticket)
  reservations!: Reservation[];

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}