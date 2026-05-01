import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1777523788407 implements MigrationInterface {
    name = 'InitialSchema1777523788407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reservations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "ticketId" integer NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','CANCELLED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`CREATE INDEX "idx_reservations_status" ON "reservations" ("status") WHERE status = 'PENDING'`);
        await queryRunner.query(`CREATE TABLE "ticket_categories" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "slug" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_dd6973d4353e33c190b64e7c938" UNIQUE ("slug"))`);
        await queryRunner.query(`CREATE TABLE "tickets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "concertId" integer NOT NULL, "name" varchar NOT NULL, "ticketCode" varchar NOT NULL, "categoryId" integer, "price" decimal(10,2) NOT NULL, "totalStock" integer NOT NULL, "availableStock" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_b8bea55b3944f5aeb2219d1627e" UNIQUE ("ticketCode"))`);
        await queryRunner.query(`CREATE INDEX "IDX_TICKET_CONCERT_ID" ON "tickets" ("concertId") `);
        await queryRunner.query(`CREATE TABLE "concerts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "slug" varchar NOT NULL, "venue" varchar NOT NULL, "date" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_b0239f527cb129cc0e7e63487cf" UNIQUE ("slug"))`);
        await queryRunner.query(`DROP INDEX "idx_reservations_status"`);
        await queryRunner.query(`CREATE TABLE "temporary_reservations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "ticketId" integer NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','CANCELLED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_d7dbf48ad681965ca77e3cbde13" FOREIGN KEY ("ticketId") REFERENCES "tickets" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reservations"("id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt") SELECT "id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt" FROM "reservations"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`ALTER TABLE "temporary_reservations" RENAME TO "reservations"`);
        await queryRunner.query(`CREATE INDEX "idx_reservations_status" ON "reservations" ("status") WHERE status = 'PENDING'`);
        await queryRunner.query(`DROP INDEX "IDX_TICKET_CONCERT_ID"`);
        await queryRunner.query(`CREATE TABLE "temporary_tickets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "concertId" integer NOT NULL, "name" varchar NOT NULL, "ticketCode" varchar NOT NULL, "categoryId" integer, "price" decimal(10,2) NOT NULL, "totalStock" integer NOT NULL, "availableStock" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_b8bea55b3944f5aeb2219d1627e" UNIQUE ("ticketCode"), CONSTRAINT "FK_229003a8365ef3e75e122cab4bc" FOREIGN KEY ("concertId") REFERENCES "concerts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f47458a36c743b14e0371b70a6e" FOREIGN KEY ("categoryId") REFERENCES "ticket_categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tickets"("id", "concertId", "name", "ticketCode", "categoryId", "price", "totalStock", "availableStock", "createdAt", "updatedAt") SELECT "id", "concertId", "name", "ticketCode", "categoryId", "price", "totalStock", "availableStock", "createdAt", "updatedAt" FROM "tickets"`);
        await queryRunner.query(`DROP TABLE "tickets"`);
        await queryRunner.query(`ALTER TABLE "temporary_tickets" RENAME TO "tickets"`);
        await queryRunner.query(`CREATE INDEX "IDX_TICKET_CONCERT_ID" ON "tickets" ("concertId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_TICKET_CONCERT_ID"`);
        await queryRunner.query(`ALTER TABLE "tickets" RENAME TO "temporary_tickets"`);
        await queryRunner.query(`CREATE TABLE "tickets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "concertId" integer NOT NULL, "name" varchar NOT NULL, "ticketCode" varchar NOT NULL, "categoryId" integer, "price" decimal(10,2) NOT NULL, "totalStock" integer NOT NULL, "availableStock" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_b8bea55b3944f5aeb2219d1627e" UNIQUE ("ticketCode"))`);
        await queryRunner.query(`INSERT INTO "tickets"("id", "concertId", "name", "ticketCode", "categoryId", "price", "totalStock", "availableStock", "createdAt", "updatedAt") SELECT "id", "concertId", "name", "ticketCode", "categoryId", "price", "totalStock", "availableStock", "createdAt", "updatedAt" FROM "temporary_tickets"`);
        await queryRunner.query(`DROP TABLE "temporary_tickets"`);
        await queryRunner.query(`CREATE INDEX "IDX_TICKET_CONCERT_ID" ON "tickets" ("concertId") `);
        await queryRunner.query(`DROP INDEX "idx_reservations_status"`);
        await queryRunner.query(`ALTER TABLE "reservations" RENAME TO "temporary_reservations"`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "ticketId" integer NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','CANCELLED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`INSERT INTO "reservations"("id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt") SELECT "id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt" FROM "temporary_reservations"`);
        await queryRunner.query(`DROP TABLE "temporary_reservations"`);
        await queryRunner.query(`CREATE INDEX "idx_reservations_status" ON "reservations" ("status") WHERE status = 'PENDING'`);
        await queryRunner.query(`DROP TABLE "concerts"`);
        await queryRunner.query(`DROP INDEX "IDX_TICKET_CONCERT_ID"`);
        await queryRunner.query(`DROP TABLE "tickets"`);
        await queryRunner.query(`DROP TABLE "ticket_categories"`);
        await queryRunner.query(`DROP INDEX "idx_reservations_status"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
    }

}
