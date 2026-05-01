// src/jobs/cleanup.job.ts
import cron from "node-cron";
import { ReservationService } from "../modules/reservation/reservation.service";

const reservationService = new ReservationService();

export const startCleanupJob = () => {
  // runs every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("[Cleanup Job] Checking for expired reservations...");

    try {
      const result = await reservationService.releaseExpiredReservations();
      const released = result.data;

      if (released > 0) {
        console.log(`[Cleanup Job] Released ${released} expired reservation(s) ✅`);
      } else {
        console.log("[Cleanup Job] No expired reservations found.");
      }
    } catch (err) {
      console.error("[Cleanup Job] Error during cleanup:", err);
    }
  });

  console.log("[Cleanup Job] Scheduler started 🕐");
};