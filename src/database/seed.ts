// src/database/seed.ts
import "reflect-metadata";
import { AppDataSource } from "./index";
import { TicketCategory } from "../modules/ticket-category/ticket-category.entity";
import { Concert } from "../modules/concert/concert.entity";
import { Ticket } from "../modules/ticket/ticket.entity";
import { ReservationService } from "../modules/reservation/reservation.service";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Database initialized for seeding...");

    const categoryRepo = AppDataSource.getRepository(TicketCategory);
    const concertRepo = AppDataSource.getRepository(Concert);
    const ticketRepo = AppDataSource.getRepository(Ticket);
    const reservationService = new ReservationService();

    // 1. Seed Ticket Categories
    console.log("Seeding categories...");
    const categories = [
      { name: "VIP", slug: "vip" },
      { name: "Premium", slug: "premium" },
      { name: "General Admission", slug: "general" },
      { name: "Standing", slug: "standing" },
    ];

    const savedCategories = [];
    for (const cat of categories) {
      let category = await categoryRepo.findOneBy({ slug: cat.slug });
      if (!category) {
        category = categoryRepo.create(cat);
        category = await categoryRepo.save(category);
      }
      savedCategories.push(category);
    }

    // 2. Seed Concerts
    console.log("Seeding concerts...");
    const concerts = [
      {
        name: "Eras Tour",
        slug: "eras-tour-2026",
        venue: "National Stadium",
        date: new Date("2026-06-15T20:00:00Z"),
      },
      {
        name: "World of Wonder",
        slug: "wow-concert",
        venue: "Indoor Stadium",
        date: new Date("2026-07-20T19:00:00Z"),
      },
    ];

    const savedConcerts = [];
    for (const con of concerts) {
      let concert = await concertRepo.findOneBy({ slug: con.slug });
      if (!concert) {
        concert = concertRepo.create(con);
        concert = await concertRepo.save(concert);
      }
      savedConcerts.push(concert);
    }

    // 3. Seed Tickets
    console.log("Seeding tickets...");
    const ticketPrices: Record<string, number> = {
      vip: 599.99,
      premium: 299.99,
      general: 149.99,
      standing: 99.99,
    };

    for (const concert of savedConcerts) {
      for (const category of savedCategories) {
        const ticketCode = `${concert.slug}-${category.slug}`.toUpperCase();
        
        let ticket = await ticketRepo.findOneBy({ ticketCode });
        if (!ticket) {
          ticket = ticketRepo.create({
            concertId: concert.id,
            categoryId: category.id,
            name: `${concert.name} - ${category.name}`,
            ticketCode,
            price: ticketPrices[category.slug] || 100,
            totalStock: 100,
            availableStock: 100,
          });
          await ticketRepo.save(ticket);
        }
      }
    }

    // 4. Create some initial reservations to test stock logic
    console.log("Seeding initial reservations...");
    const allTickets = await ticketRepo.find();
    
    // Reserve the first ticket for User 1
    if (allTickets[0]) {
      await reservationService.reserve({
        userId: 1,
        ticketId: allTickets[0].id
      });
      console.log(`Reserved ticket ${allTickets[0].ticketCode} for User 1`);
    }

    // Reserve the second ticket for User 2
    if (allTickets[1]) {
      await reservationService.reserve({
        userId: 2,
        ticketId: allTickets[1].id
      });
      console.log(`Reserved ticket ${allTickets[1].ticketCode} for User 2`);
    }

    console.log("Seeding completed successfully! ✅");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
