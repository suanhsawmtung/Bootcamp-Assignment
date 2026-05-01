// src/scripts/proof-transaction.ts
import "reflect-metadata";
import { AppDataSource } from "../database";
import { Ticket } from "../modules/ticket/ticket.entity";
import { Reservation } from "../modules/reservation/reservation.entity";

async function proveRollback() {
  try {
    await AppDataSource.initialize();
    console.log("--------------------------------------------------");
    console.log("🚀 STARTING TRANSACTION ROLLBACK PROOF");
    console.log("--------------------------------------------------");

    const ticketRepo = AppDataSource.getRepository(Ticket);
    
    // 1. Pick a ticket to test
    const testTicket = await ticketRepo.findOneBy({});
    if (!testTicket) {
      console.error("❌ No tickets found. Please run yarn seed first.");
      process.exit(1);
    }

    const initialStock = testTicket.availableStock;
    console.log(`[Step 1] Initial Ticket Stock (${testTicket.ticketCode}): ${initialStock}`);

    // 2. Start a transaction and intentionally fail it
    console.log("\n[Step 2] Starting transaction to decrement stock and then FAIL...");
    
    try {
      await AppDataSource.transaction(async (manager) => {
        // Decrement stock
        testTicket.availableStock -= 1;
        await manager.save(testTicket);
        console.log(`   -> Stock decremented to ${testTicket.availableStock} inside transaction.`);

        // INTENTIONAL FAILURE
        console.log("   -> 🔥 SIMULATING UNEXPECTED ERROR BEFORE COMMIT...");
        throw new Error("CRITICAL_DATABASE_FAILURE_SIMULATION");
      });
    } catch (err: any) {
      if (err.message === "CRITICAL_DATABASE_FAILURE_SIMULATION") {
        console.log("   -> ✅ Caught the expected simulated error.");
      } else {
        throw err;
      }
    }

    // 3. Verify the rollback
    console.log("\n[Step 3] Verifying if stock was rolled back in the database...");
    
    // We must fetch a FRESH copy from the DB to see the actual state
    const ticketAfterFailure = await ticketRepo.findOneBy({ id: testTicket.id });
    const finalStock = ticketAfterFailure?.availableStock;

    console.log(`[Step 4] Final Ticket Stock in DB: ${finalStock}`);

    if (finalStock === initialStock) {
      console.log("\n--------------------------------------------------");
      console.log("🏆 PROOF SUCCESSFUL: The stock was ROLLED BACK!");
      console.log("The database state remained unchanged despite the partial logic execution.");
      console.log("--------------------------------------------------");
    } else {
      console.error("\n--------------------------------------------------");
      console.error("❌ PROOF FAILED: The stock was NOT rolled back.");
      console.error(`Initial: ${initialStock}, Final: ${finalStock}`);
      console.error("--------------------------------------------------");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error during proof script:", error);
    process.exit(1);
  }
}

proveRollback();
