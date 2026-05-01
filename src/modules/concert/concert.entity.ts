// src/modules/concert/concert.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "../ticket/ticket.entity";

@Entity("concerts")
export class Concert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
  
  @Column({ unique: true })
  slug!: string;

  @Column()
  venue!: string;

  @Column({ type: "datetime" })
  date!: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.concert)
  tickets!: Ticket[];

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}