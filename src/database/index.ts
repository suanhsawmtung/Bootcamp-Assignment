import "reflect-metadata";
import { DataSource } from "typeorm";
import { Concert } from "../modules/concert/concert.entity";
import { Reservation } from "../modules/reservation/reservation.entity";
import { Ticket } from "../modules/ticket/ticket.entity";
import { TicketCategory } from "../modules/ticket-category/ticket-category.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: false,
  logging: true,
  entities: [Concert, Reservation, Ticket, TicketCategory],
  migrations: [ __dirname + "/migrations/*.{ts,js}" ],
});